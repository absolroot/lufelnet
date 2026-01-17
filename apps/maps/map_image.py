import json
import os
import traceback
from PIL import Image

from enemy import parse_enemy
from skill import compile_skill

# Global Configuration
ASSET_LOCATION = "C:\\Users\\iantLegion\\Desktop\\files\\Sprite\\Texture2D"
UNITY_ASSET_PATH = "C:\\Users\\iantLegion\\Desktop\\test\\ExportedProject\\Assets"

# Data Files Configuration
DATA_FILES = {
    'SCENE': './default/ConfScene.json',
    'MAPBLOCK': './develop/ConfMapBlock.json',
    'MINIMAP': './develop/ConfMinimap.json',
    'ROLLMAP': './checkpoint/ConfPrefabRollMap.json',
    'ROLLMAP_PIECE': './checkpoint/ConfRollMapPiece.json',
    'PALACE_OBJECT': './checkpoint/ConfPalaceObject.json',
    'PALACE_AREA': "./default/ConfPalaceArea.json",
    'PALACE_WORLD_AREA': "./default/ConfPalaceWorldArea.json",
    'PALACE_WORLD': "./default/ConfPalaceWorld.json",
    'PALACE_LOGIC': "./default/ConfPalaceLogic.json",
    'NPC': './checkpoint/ConfNpc.json',
    'AINPC': './checkpoint/ConfAINPC.json',
    'ZHANDOU': './battle/ConfZhanDou.json',
    'GUAIWU': "./text/ConfGuaiWu.json",
    "INST": "./battle/ConfInst.json",
    "INST_TUTORIAL": "./develop/ConfInstTutorials.json",
    "SKILL": './battle/ConfSkill.json',
}

class DataManager:
    def __init__(self):
        self.data = {}
        self._load_all_data()

    def _load_all_data(self):
        for key, path in DATA_FILES.items():
            self.data[key] = self._load_json(path)

    def _load_json(self, path):
        data = []
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.loads(f.read())
        except Exception as e:
            # print(f"Warning: Failed to load {path}: {e}")
            return []

        try:
            filename = os.path.basename(path)
            name, ext = os.path.splitext(filename)
            trans_path = f"./conftranslationen/{name}_EN{ext}"

            if os.path.exists(trans_path):
                with open(trans_path, 'r', encoding='utf-8') as f:
                    trans_data = json.loads(f.read())

                if isinstance(data, list) and isinstance(trans_data, list):
                    trans_map = {item['sn']: item for item in trans_data if isinstance(item, dict) and 'sn' in item}
                    
                    if trans_map:
                        for item in data:
                            if isinstance(item, dict) and 'sn' in item:
                                if str(item['sn']) in trans_map:
                                    item.update(trans_map[str(item['sn'])])
        except Exception:
            pass

        return data

    def get_map_block(self, scene_sn):
        return [i for i in self.data['MAPBLOCK'] if i['mapSn'] == scene_sn]

    def get_palace_object(self, scene_sn):
        return [i for i in self.data['PALACE_OBJECT'] if i['sceneSN'] == str(scene_sn)]

    def get_minimap(self, scene_sn):
        return next((i for i in self.data['MINIMAP'] if i['sn'] == scene_sn), None)

    def get_rollmap(self, scene_sn):
        return next((i for i in self.data['ROLLMAP'] if i['sn'] == scene_sn), None)

    def get_rollmap_piece(self, scene_sn):
        return next((i for i in self.data['ROLLMAP_PIECE'] if i['sn'] == int(scene_sn)), None)

    def get_scene(self, scene_sn):
        return next((i for i in self.data['SCENE'] if i['sn'] == scene_sn), None)

    def get_palace_area(self, scene_sn):
        return next((i for i in self.data['PALACE_AREA'] if i['sn'] == scene_sn), None)

    def get_palace_world_area(self, scene_sn):
        return next((i for i in self.data['PALACE_WORLD_AREA'] if i['sn'] == scene_sn), None)

    def get_palace_world(self, scene_sn):
        return next((i for i in self.data['PALACE_WORLD'] if i['sn'] == scene_sn), None)

    def get_palace_logic(self, scene_sn):
        return next((i for i in self.data['PALACE_LOGIC'] if i['sn'] == scene_sn), None)

    def get_npc(self, scene_sn):
        return [i for i in self.data['NPC'] if i['stageSn'] == scene_sn]
    
    def get_ainpc(self, scene_sn):
        return [i for i in self.data['AINPC'] if i['sn'] == scene_sn]
    
    def get_zhandou(self, scene_sn):
        return [i for i in self.data['ZHANDOU'] if i['monsterGroup'] == int(scene_sn)]

    def get_guaiwu(self, scene_sn):
        return [i for i in self.data['GUAIWU'] if i['sn'] == scene_sn]
    
    def get_inst(self, scene_sn):
        return next((i for i in self.data['INST'] if i['sn'] == scene_sn), None)
    
    def get_inst_tutorial(self, scene_sn):
        return next((i for i in self.data['INST_TUTORIAL'] if i['sn'] == scene_sn), None)
    
    def get_skill(self, scene_sn):
        return next((i for i in self.data['SKILL'] if i['sn'] == scene_sn), None)

# Global Data Manager Instance
dm = DataManager()

# Helper Functions
def str_to_int(s):
    return round(float(s))

def rotate_and_expand(image, angle, pivot):
    w, h = image.size
    px, py = pivot
    new_w = round(max(px, w - px) * 2)
    new_h = round(max(py, h - py) * 2)
    canvas = Image.new('RGBA', (new_w, new_h), (0, 0, 0, 0))
    paste_x = round(new_w / 2 - px)
    paste_y = round(new_h / 2 - py)
    canvas.paste(image, (paste_x, paste_y))
    rotated_canvas = canvas.rotate(angle, center=(paste_x + px, paste_y + py), expand=True)
    return rotated_canvas

def _get_asset_value(name, key_pattern):
    link = UNITY_ASSET_PATH
    yml_file = f"{link}\\{name}.asset"
    if "kongtu" in name:
        return (0.5, 0.5)
    
    try:
        with open(yml_file, 'r', encoding='utf-8') as f:
            for line in f:
                if key_pattern in line:
                    pivot_line = line.strip()
                    pivot_values = pivot_line.split(':')[1:]
                    val_x = float(pivot_values[1].split(",")[0].strip())
                    val_y = float(pivot_values[2].split("}")[0].strip())
                    return (val_x, val_y)
    except FileNotFoundError:
        pass
    except Exception:
        pass
    return None

def get_ratio_xy(name):
    return _get_asset_value(name, "m_Pivot")

def get_offset_xy(name):
    return _get_asset_value(name, "m_Offset")

def connectivity(rollmap_piece, max_size, width, height):
    # Preserving function as requested, though seemingly unused in main logic
    connectivity = rollmap_piece["connectivity"]
    x_start, y_start, x_end, y_end = 1, 1, 1, 1
    scaled_x_start = max_size // 2 - width // 2
    scaled_y_start = max_size // 2 - height // 2
    scaled_x_end = scaled_x_start + width
    scaled_y_end = scaled_y_start + height
    if connectivity[0] == '1':
        x_start = 0; scaled_x_end = max_size; scaled_x_start = max_size - width
    if connectivity[1] == '1':
        y_start = 0; scaled_y_start = max_size - height; scaled_y_end = max_size
    if connectivity[2] == '1':
        x_end = 0; scaled_x_end = width; scaled_x_start = 0
    if connectivity[3] == '1':
        y_end = 0; scaled_y_start = 0; scaled_y_end = height
    print((scaled_x_start, scaled_y_start, scaled_x_end, scaled_y_end))
    print(connectivity, width, height, max_size)
    return (scaled_x_start, scaled_y_start, scaled_x_end, scaled_y_end)

# Exposing compatible getters for backward compatibility if needed, 
# relying on the global dm instance.
def get_map_block(scene_sn): return dm.get_map_block(scene_sn)
def get_palace_object(scene_sn): return dm.get_palace_object(scene_sn)
def get_minimap(scene_sn): return dm.get_minimap(scene_sn)
def get_rollmap(scene_sn): return dm.get_rollmap(scene_sn)
def get_rollmap_piece(scene_sn): return dm.get_rollmap_piece(scene_sn)
def get_scene(scene_sn): return dm.get_scene(scene_sn)
def get_palace_area(scene_sn): return dm.get_palace_area(scene_sn)
def get_palace_world_area(scene_sn): return dm.get_palace_world_area(scene_sn)
def get_palace_world(scene_sn): return dm.get_palace_world(scene_sn)
def get_palace_logic(scene_sn): return dm.get_palace_logic(scene_sn)
def get_npc(scene_sn): return dm.get_npc(scene_sn)
def get_ainpc(scene_sn): return dm.get_ainpc(scene_sn)
def get_zhandou(scene_sn): return dm.get_zhandou(scene_sn)
def get_guaiwu(scene_sn): return dm.get_guaiwu(scene_sn)
def get_inst(scene_sn): return dm.get_inst(scene_sn)
def get_inst_tutorial(scene_sn): return dm.get_inst_tutorial(scene_sn)
def get_skill(scene_sn): return dm.get_skill(scene_sn)

# Main Builder Logic
def build_map_image(scene_sn, folder_name="", floor_names=[]):
    if isinstance(scene_sn, str):
        scene_sn_list = list(map(int, scene_sn.split(',')))
    else:
        scene_sn_list = [scene_sn]
    
    scene = get_scene(scene_sn_list[0])
    if not scene:
        print(f"Scene {scene_sn_list[0]} not found.")
        return

    if scene["scene_type"] != 601:
        _build_standard_map(scene, scene_sn_list, folder_name, floor_names)
    else:
        _build_roll_map(scene, scene_sn_list, folder_name)

def _get_image_safe(path):
    if os.path.exists(path):
        return Image.open(path).convert("RGBA")
    print(f"Missing image: {path}")
    return None

def _calculate_pixel_pos(world_pos, map_start_real, ratio, map_start_pixel, invert_y=False, canvas_height=0):
    # world_pos: (x, z) usually
    # ratio: (rx, ry)
    # result = (world - real_start) * ratio + start_pixel
    x = (world_pos[0] - map_start_real[0]) * ratio[0] + map_start_pixel[0]
    y = (world_pos[1] - map_start_real[1]) * ratio[1] + map_start_pixel[1]
    
    # Often Y is inverted in the final drawing relative to bottom-left origin
    # But the formula in original code varies. Standard map:
    # pos = [(pos[0] - map_start_real_pos[0]) * ratiox + map_start_pos[0], \
    #        (pos[2] - map_start_real_pos[1]) * ratioy + map_start_pos[1]]
    # Then adjustment:
    # pos = [pos[0] - piece_image.width * ratio_xy[0], minimap_size[1] - pos[1] - piece_image.height * ratio_xy[1]]
    return [x, y]

def _draw_entities(dst, final_data, entity_list, type_key, minimap_params, map_config):
    # minimap_params: (map_start_real_pos, ratio, map_start_pos, minimap_size, height_range)
    # map_config: { 'rotation_key': 'iconRot' or 'faceToAngle', 'invert_rotation': bool }
    
    map_start_real_pos, ratio, map_start_pos, minimap_size, height_range = minimap_params
    ratiox, ratioy = ratio
    
    sort_list = entity_list
    # In original code, it iterates scene_sn list, retrieves objects for each, and draws.
    # Here we assume entity_list is already populated with the actual objects to draw.
    
    for entity in entity_list:
        if entity.get("mapIcon") == "AAAAAA==": continue
        
        map_icons = entity.get("mapIcon", "").split(',')
        desired_image = next((i for i in map_icons if i != ""), None)
        if not desired_image: continue

        entity_img = _get_image_safe(f"{ASSET_LOCATION}\\{desired_image}")
        if not entity_img: continue

        # Scaling
        image_scale = (minimap_size[0] // 45) / entity_img.width
        
        # Rotation
        rot_deg = 0
        if map_config['rotation_key'] == 'iconRot':
             rot_deg = float(entity.get("iconRot", 0))
        elif map_config['rotation_key'] == 'faceToAngle':
             # Format "x,y,z" -> take y. Negated in original code
             vals = entity.get("faceToAngle", "0,0,0").split(',')
             if len(vals) > 1:
                 rot_deg = -float(vals[1])
        
        # Apply rotation and resize
        # Original code: rotate then resize.
        entity_img = entity_img.rotate(rot_deg, expand=True)
        entity_img = entity_img.resize((int(entity_img.width * image_scale), int(entity_img.height * image_scale)))

        # Position
        pos_str = entity.get("birthPoint", "0,0,0").split(',')
        pos_nums = list(map(str_to_int, pos_str)) # [x, y, z] usually, but code accesses pos[1] for height check
        
        # Height check
        # In original code: pos[1] is checked against minimap_min_height/max_height
        # But for position calc: x=pos[0], y=pos[2]
        if height_range:
            min_h, max_h = height_range
            if not (min_h < pos_nums[1] < max_h):
                continue
        
        # Calculate canvas coords
        # pos[0] is x, pos[2] is z (mapped to Y on screen)
        world_x, world_y = pos_nums[0], pos_nums[2] 
        
        calc_x = (world_x - map_start_real_pos[0]) * ratiox + map_start_pos[0]
        calc_y = (world_y - map_start_real_pos[1]) * ratioy + map_start_pos[1]
        
        # Adjust for image pivot (center) and canvas Y inversion often present in 2D maps
        # Original: minimap_size[1] - pos[1] - image.height/2
        final_x = calc_x - entity_img.width // 2
        final_y = minimap_size[1] - calc_y - entity_img.height // 2
        
        final_pos = list(map(str_to_int, [final_x, final_y]))
        
        dst.paste(entity_img, tuple(final_pos), mask=entity_img)
        
        if type_key == "enemies":
            enemy_data = {"instSn": 0, "enemies": [], "tutorial": {"sn": 0, "title": "", "content": ""}}
            ai_npc = get_ainpc(entity.get("sn"))
            if ai_npc:
                zhandou_list = get_zhandou(ai_npc[0].get("battleSn"))
                enemy_data["instSn"] = ai_npc[0].get("battleSn")
                for zhandou in zhandou_list:
                    enemy = parse_enemy(get_guaiwu(int(zhandou.get("monster")))[0])
                    for en in enemy:
                        for skill in en["skill"].split(','):
                            skill_data = get_skill(int(skill))
                            print(skill_data)
                            skill_compiled = compile_skill(skill_data)
                            skill_compiled["desc"] = skill_compiled["desc"][1]
                            en.setdefault("skill_data", []).append(skill_compiled)
                        del en["skill"]
                    enemy_data["enemies"].append(enemy)
                inst_data = get_inst(ai_npc[0].get("battleSn"))
                if inst_data:
                    tutorial_sn = inst_data.get("instTutorial")
                    tutorial_data = get_inst_tutorial(tutorial_sn)
                    if tutorial_data:
                        enemy_data["tutorial"]["sn"] = tutorial_sn
                        enemy_data["tutorial"]["title"] = tutorial_data.get("title", "")
                        enemy_data["tutorial"]["content"] = tutorial_data.get("text", "")
            else:
                enemy_data = None

        final_data[type_key].append({
            "sn": entity.get("sn"),
            "image": desired_image,
            "position": final_pos,
            "ratio": image_scale,
            "rotate": rot_deg,
            "rotate_pivot": [0.5, 0.5],
            "enemy_data": enemy_data if type_key == "enemies" else None
        })


def _build_standard_map(scene, scene_sn_list, folder_name, floor_names):
    for idx, minimap_sn in enumerate(scene["miniMapSn"].split(',')):
        final_data = {"tiles": [], "objects": [], "enemies": []}
        minimap = get_minimap(minimap_sn)
        if not minimap: continue

        # 1. Parse Parameters
        if minimap["height"] != "AAAAAA==":
            min_h, max_h = map(str_to_int, minimap["height"].split(','))
        else:
            min_h, max_h = -99999, 99999
        
        minimap_param = minimap["map_param"].split('|')
        # Param indices: 
        # 0: start_real (x,?,y,?) -> [0::2]
        # 1: start_offset -> [x, y]
        # 2: end_real
        # 3: end_offset
        # 4: size
        
        minimap_size = list(map(str_to_int, minimap_param[4].split(','))) # [w, h]
        
        map_start_real_pos = list(map(str_to_int, minimap_param[0].split(',')[0::2]))
        temp_start = list(map(str_to_int, minimap_param[1].split(',')))
        map_start_pos = [minimap_size[0] // 2 - temp_start[0], minimap_size[1] // 2 - temp_start[1]]
        
        map_end_real_pos = list(map(str_to_int, minimap_param[2].split(',')[0::2]))
        # temp_end = list(map(str_to_int, minimap_param[3].split(',')))
        map_end_pos = [minimap_size[0] // 2 - list(map(str_to_int, minimap_param[3].split(',')))[0], 
                       minimap_size[1] // 2 - list(map(str_to_int, minimap_param[3].split(',')))[1]]

        ratiox = (map_end_pos[0] - map_start_pos[0]) / (map_end_real_pos[0] - map_start_real_pos[0])
        ratioy = (map_end_pos[1] - map_start_pos[1]) / (map_end_real_pos[1] - map_start_real_pos[1])

        # 2. Setup Canvas
        if minimap.get("mapBgName") != "AAAAAA==":
            bg_name = minimap['mapBgName']
            bg_path = f"{ASSET_LOCATION}\\{bg_name}"
            dst = _get_image_safe(bg_path)
            if dst:
                final_data["map_size"] = dst.size
                final_data["tiles"].append({"image": bg_name, "position": (0, 0), "ratio": 1, "rotate": 0})
            else:
                dst = Image.new('RGBA', tuple(minimap_size))
        else:
            dst = Image.new('RGBA', tuple(map(int, minimap_size)))
            final_data["map_size"] = dst.size
            
            # Draw blocks
            block_list = get_map_block(minimap_sn)
            for block in block_list:
                img_name = block['img']
                block_img = _get_image_safe(f"{ASSET_LOCATION}\\{img_name}")
                if not block_img: continue
                
                pos_raw = list(map(str_to_int, block["pos"].split(',')[0:2]))
                
                try:
                    ratio_xy = get_ratio_xy(img_name.replace(".png", "")) or (0.5, 0.5)
                    offset_xy = get_offset_xy(img_name.replace(".png", "")) or (0, 0)
                except Exception as e:
                    print(f"Error getting ratio/offset for {img_name}: {e}")
                    ratio_xy, offset_xy = (0.5, 0.5), (0, 0)
                    
                # Complex positioning logic from original code
                # pos = [minimap_size[0] / 2 + pos[0] - width * ratio_x, minimap_size[1] / 2 + offset_y * 2 - pos[1] - height * ratio_y]
                # Note: offset_xy[1] * 2 usage is specific to original code
                
                final_x = minimap_size[0] / 2 + pos_raw[0] - block_img.width * ratio_xy[0]
                final_y = minimap_size[1] / 2 + offset_xy[1] * 2 - pos_raw[1] - block_img.height * ratio_xy[1]
                
                pos_final = list(map(str_to_int, [final_x, final_y]))
                dst.paste(block_img, tuple(pos_final), mask=block_img)
                
                final_data["tiles"].append({
                    "image": img_name,
                    "position": pos_final,
                    "ratio": 1,
                    "rotate": 0,
                    "rotate_pivot": [0.5, 0.5],
                })

        # 3. Draw Objects & Enemies
        # Gather all objects for all scenes in scene_sn_list
        all_objects = []
        for s_sn in scene_sn_list:
            all_objects.extend(get_palace_object(s_sn))
        
        all_npcs = []
        for s_sn in scene_sn_list:
            all_npcs.extend(get_npc(s_sn))

        common_params = (map_start_real_pos, (ratiox, ratioy), map_start_pos, minimap_size, (min_h, max_h))
        
        _draw_entities(dst, final_data, all_objects, "objects", common_params, 
                       {'rotation_key': 'iconRot'})
        _draw_entities(dst, final_data, all_npcs, "enemies", common_params, 
                       {'rotation_key': None}) 

        # 4. Save
        suffix = f"_{floor_names[idx]}" if floor_names else f"_{idx}"
        scene_name_clean = scene['name'].replace("?", "")
        filename = f"{scene_name_clean}{suffix}"
        
        save_path = f"./{folder_name}/{filename}.png"
        json_path = f"./{folder_name}/{filename}_data.json"
        
        dst.save(save_path)
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=4)

def _build_roll_map(scene, scene_sn_list, folder_name):
    final_data = {"tiles": [], "objects": [], "enemies": []}
    
    # 1. Calculate Bounds
    rollmap = get_rollmap(scene["prefabRollMapSn"])
    if not rollmap: return

    sub_pos_list = rollmap['mapPiecePositions'].split('|')
    map_pieces_sn = rollmap['mapPieces'].split(',')
    
    minx, miny, maxx, maxy = 9999, 9999, 0, 0
    for i, _ in enumerate(map_pieces_sn):
        if i >= len(sub_pos_list): break
        pos = list(map(float, sub_pos_list[i].split(',')))
        x, y = pos[0], pos[2] if len(pos) > 2 else 0
        minx, miny = min(minx, x), min(miny, y)
        maxx, maxy = max(maxx, x), max(maxy, y)
    
    maxx += 20; maxy += 20; minx -= 20; miny -= 20
    
    minimap = get_minimap(scene["miniMapSn"])
    ratio = float(minimap["map_param"]) if minimap else 1.0
    
    map_width = int((maxx - minx) * ratio)
    map_height = int((maxy - miny) * ratio)
    
    minimap_size = (map_width, map_height)
    print(minimap_size)
    
    dst = Image.new('RGBA', minimap_size)
    final_data["map_size"] = dst.size
    
    map_start_real_pos = (minx, miny)
    map_start_pos = (0, 0)
    
    # 2. Draw Tiles (Roll Map Specific)
    piece_positions_str = rollmap['mapPiecePositions'].split('|')
    piece_rotations_str = rollmap['mapPieceRotations'].split(',')
    
    for idx, piece_sn in enumerate(map_pieces_sn):
        map_piece = get_rollmap_piece(piece_sn)
        if not map_piece or map_piece["blockMap"] == "AAAAAA==": continue
        
        img_name = map_piece["blockMap"]
        piece_image = _get_image_safe(f"{ASSET_LOCATION}\\{img_name}")
        if not piece_image: continue

        # Resize Logic
        uiSize = tuple(map(str_to_int, map_piece['uiSize'].split(',')))
        scale_ratio = min(uiSize[0] / max(128, piece_image.width), uiSize[1] / max(128, piece_image.height))
        if img_name == "xiaoditu-yxkj-zhantai.png":
            scale_ratio *= 0.87
        
        new_size = (str_to_int(piece_image.width * scale_ratio), str_to_int(piece_image.height * scale_ratio))
        piece_image = piece_image.resize(new_size)
        
        # Rotation
        ratio_xy = get_ratio_xy(img_name.replace(".png", "")) or (0.5, 0.5)
        # pivot calculation implies pixel coordinates
        pivot = (piece_image.width * ratio_xy[0], piece_image.height * (1-ratio_xy[1]))
        
        rot_deg = -float(piece_rotations_str[idx]) if idx < len(piece_rotations_str) else 0
        
        # Position - Adjusted for floating point precision
        pos_nums = list(map(float, piece_positions_str[idx].split(','))) 
        calc_x = (pos_nums[0] - map_start_real_pos[0]) * ratio + map_start_pos[0]
        calc_y = (pos_nums[2] - map_start_real_pos[1]) * ratio + map_start_pos[1]
        
        if abs(rot_deg) < 0.01:
            # Emulate rotate_and_expand logic preventing sub-pixel errors
            w, h = piece_image.size
            px, py = pivot
            
            new_w = round(max(px, w - px) * 2)
            new_h = round(max(py, h - py) * 2)
            
            paste_x = round(new_w / 2 - px)
            paste_y = round(new_h / 2 - py)
            
            # Calculate final position using the expanded box logic to match rotation pathway
            final_x = (calc_x - new_w // 2) + paste_x
            final_y = ((minimap_size[1] - calc_y) - new_h // 2) + paste_y
        else:
            piece_image = rotate_and_expand(piece_image, rot_deg, pivot)
            # Use floating point division for accurate centering of rotated images
            final_x = calc_x - piece_image.width / 2.0
            final_y = minimap_size[1] - calc_y - piece_image.height / 2.0
        
        pos_final = list(map(str_to_int, [final_x, final_y]))
        dst.paste(piece_image, tuple(pos_final), mask=piece_image)
        
        final_data["tiles"].append({
            "image": img_name,
            "position": pos_final,
            "ratio": scale_ratio,
            "rotate": rot_deg,
            "rotate_pivot": ratio_xy
        })
        
    # 3. Draw Objects & Enemies
    # For roll map, only scene_sn[0] is used for objects?
    # Original: palace_object_list = get_palace_object(scene_sn[0])
    objects_list = get_palace_object(scene_sn_list[0])
    npc_list = []
    for s_in in scene_sn_list:
        npc_list.extend(get_npc(s_in))
        
    common_params = (map_start_real_pos, (ratio, ratio), map_start_pos, minimap_size, None) # No height range
    
    _draw_entities(dst, final_data, objects_list, "objects", common_params, 
                   {'rotation_key': 'faceToAngle'})
    _draw_entities(dst, final_data, npc_list, "enemies", common_params, 
                   {'rotation_key': None})

    # 4. Save
    scene_name_clean = scene['name'].replace("?", "")
    dst.save(f"./{folder_name}/{scene_name_clean}_0.png")
    
    with open(f"./{folder_name}/{scene_name_clean}_data.json", 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    palace_logic = 5
    palace_data = get_palace_logic(palace_logic)
    os.makedirs(f"./{palace_data['brokenName']}", exist_ok=True)
    area_sn_list = list(map(int, palace_data['childPalace'].split(',')))
    for palace_sn in area_sn_list:
        palace = get_palace_area(palace_sn)
        if palace["floorName"] != "AAAAAA==":
            floor_names = palace["floorName"].split(',')
        else:
            floor_names = []
        try:
            build_map_image(palace["palaceWorldSn"], folder_name=palace_data["brokenName"], floor_names=floor_names)
        except Exception as e:
            traceback.print_exc()
            print(f"Error processing palace area SN {palace_sn}: {e}")
    
    # mementos_sn = 5
    # palace = get_palace_world(mementos_sn)
    # if palace:
    #     area_sn_list = list(map(int, palace['areaSn'].split(',')))
    #     os.makedirs(f"./{palace['Name']}", exist_ok=True)
    #     for area_sn in area_sn_list:
    #         area_data = get_palace_world_area(area_sn)
    #         if area_data:
    #             build_map_image(area_data["sceneSn"], folder_name=palace["Name"])
