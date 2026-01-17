import json
from PIL import Image

# JSON 파일 로드
json_path = "map_json/mementos/사상을 잃은 길/사상을 잃은 길 에어리어 3_data.json"

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 80)
print("PYTHON OBJECT DEBUG - 사상을 잃은 길 에어리어 3")
print("=" * 80)

# 오브젝트와 enemies 합치기
all_objects = []
if 'objects' in data:
    all_objects.extend([(obj, 'objects') for obj in data['objects']])
if 'enemies' in data:
    all_objects.extend([(obj, 'enemies') for obj in data['enemies']])

print(f"\n총 오브젝트 수: {len(all_objects)}\n")

for idx, (obj, type_key) in enumerate(all_objects):
    print(f"\n{'=' * 80}")
    print(f"OBJECT #{idx} ({type_key.upper()})")
    print(f"{'=' * 80}")
    print(f"SN: {obj.get('sn', 'N/A')}")
    print(f"Image: {obj.get('image', 'N/A')}")
    print(f"JSON Position: {obj.get('position', [])}")
    print(f"Ratio: {obj.get('ratio', 1)}")
    print(f"Rotate: {obj.get('rotate', 0)}")
    print(f"Rotate Pivot: {obj.get('rotate_pivot', [])}")
    
    # 이미지 로드 시뮬레이션 (실제 파일이 없어도 크기 추정)
    # 일반적으로 아이콘은 128x128 또는 64x64 정도
    # 실제로는 이미지를 로드해야 하지만, 여기서는 JSON 데이터만 출력
    
    # Python _draw_entities 로직 시뮬레이션
    original_w = 128  # 추정값 (실제로는 이미지 로드 필요)
    original_h = 128  # 추정값
    
    ratio = obj.get('ratio', 1)
    rot_deg = obj.get('rotate', 0)
    
    # 회전 후 확장된 크기 계산
    if abs(rot_deg) >= 0.01:
        import math
        corners = [
            [-original_w / 2, -original_h / 2],
            [original_w / 2, -original_h / 2],
            [original_w / 2, original_h / 2],
            [-original_w / 2, original_h / 2]
        ]
        
        rot_rad = math.radians(rot_deg)
        cos = math.cos(rot_rad)
        sin = math.sin(rot_rad)
        
        rotated_corners = [
            [x * cos - y * sin, x * sin + y * cos]
            for x, y in corners
        ]
        
        xs = [c[0] for c in rotated_corners]
        ys = [c[1] for c in rotated_corners]
        rotated_w = max(xs) - min(xs)
        rotated_h = max(ys) - min(ys)
    else:
        rotated_w = original_w
        rotated_h = original_h
    
    # 리사이즈된 최종 크기
    final_w = round(rotated_w * ratio)
    final_h = round(rotated_h * ratio)
    
    print(f"\n[Python 계산 결과]")
    print(f"Original Size (추정): {original_w} x {original_h}")
    print(f"Rotated Size: {rotated_w:.2f} x {rotated_h:.2f}")
    print(f"Final Size (after resize): {final_w} x {final_h}")
    print(f"Final Position (좌상단): {obj.get('position', [])}")
    print(f"Center Position (계산): [{obj.get('position', [0, 0])[0] + final_w / 2}, {obj.get('position', [0, 0])[1] + final_h / 2}]")
    
    # 메멘토스인 경우 pivot 로직
    if obj.get('rotate_pivot'):
        ratio_xy = obj.get('rotate_pivot')
        w = round(original_w * ratio)
        h = round(original_h * ratio)
        px = w * ratio_xy[0]
        py = h * (1 - ratio_xy[1])
        
        new_w = round(max(px, w - px) * 2)
        new_h = round(max(py, h - py) * 2)
        paste_x = round(new_w / 2 - px)
        paste_y = round(new_h / 2 - py)
        
        print(f"\n[메멘토스 Pivot 로직]")
        print(f"Scaled Size: {w} x {h}")
        print(f"Pivot (scaled): px={px:.2f}, py={py:.2f}")
        print(f"Expanded Canvas: {new_w} x {new_h}")
        print(f"Paste Offset: paste_x={paste_x}, paste_y={paste_y}")
        
        if abs(rot_deg) < 0.01:
            final_x = obj.get('position', [0, 0])[0] + paste_x + px
            final_y = obj.get('position', [0, 0])[1] + paste_y + py
            print(f"Final Position (no rotation): [{final_x:.2f}, {final_y:.2f}]")
        else:
            # 회전 있는 경우 expanded size 계산
            import math
            center_x = paste_x + px
            center_y = paste_y + py
            pil_angle_rad = math.radians(-rot_deg)
            cos = math.cos(pil_angle_rad)
            sin = math.sin(pil_angle_rad)
            
            canvas_corners = [
                [0, 0], [new_w, 0], [new_w, new_h], [0, new_h]
            ]
            
            rotated_corners = [
                [
                    (x - center_x) * cos - (y - center_y) * sin,
                    (x - center_x) * sin + (y - center_y) * cos
                ]
                for x, y in canvas_corners
            ]
            
            xs = [c[0] for c in rotated_corners]
            ys = [c[1] for c in rotated_corners]
            expanded_width = round(max(xs) - min(xs))
            expanded_height = round(max(ys) - min(ys))
            
            final_x = obj.get('position', [0, 0])[0] + expanded_width / 2
            final_y = obj.get('position', [0, 0])[1] + expanded_height / 2
            print(f"Expanded Size: {expanded_width} x {expanded_height}")
            print(f"Final Position (with rotation): [{final_x:.2f}, {final_y:.2f}]")

print("\n" + "=" * 80)
print("END OF PYTHON DEBUG")
print("=" * 80)

# JSON 파일로 저장
output_data = {
    "mapFileName": json_path,
    "totalObjects": len(all_objects),
    "objects": []
}

for idx, (obj, type_key) in enumerate(all_objects):
    obj_data = {
        "index": idx,
        "type": type_key,
        "sn": obj.get('sn', 'N/A'),
        "image": obj.get('image', 'N/A'),
        "jsonPosition": obj.get('position', []),
        "ratio": obj.get('ratio', 1),
        "rotate": obj.get('rotate', 0),
        "rotatePivot": obj.get('rotate_pivot', []),
        "pythonCalculations": {}
    }
    
    # Python 계산 결과 추가
    original_w = 128  # 추정값
    original_h = 128  # 추정값
    ratio = obj.get('ratio', 1)
    rot_deg = obj.get('rotate', 0)
    
    if abs(rot_deg) >= 0.01:
        import math
        corners = [
            [-original_w / 2, -original_h / 2],
            [original_w / 2, -original_h / 2],
            [original_w / 2, original_h / 2],
            [-original_w / 2, original_h / 2]
        ]
        
        rot_rad = math.radians(rot_deg)
        cos = math.cos(rot_rad)
        sin = math.sin(rot_rad)
        
        rotated_corners = [
            [x * cos - y * sin, x * sin + y * cos]
            for x, y in corners
        ]
        
        xs = [c[0] for c in rotated_corners]
        ys = [c[1] for c in rotated_corners]
        rotated_w = max(xs) - min(xs)
        rotated_h = max(ys) - min(ys)
    else:
        rotated_w = original_w
        rotated_h = original_h
    
    final_w = round(rotated_w * ratio)
    final_h = round(rotated_h * ratio)
    
    obj_data["pythonCalculations"] = {
        "originalSize": [original_w, original_h],
        "rotatedSize": [round(rotated_w, 2), round(rotated_h, 2)],
        "finalSize": [final_w, final_h],
        "finalPositionTopLeft": obj.get('position', []),
        "centerPosition": [
            obj.get('position', [0, 0])[0] + final_w / 2,
            obj.get('position', [0, 0])[1] + final_h / 2
        ]
    }
    
    # 메멘토스 pivot 로직
    if obj.get('rotate_pivot'):
        ratio_xy = obj.get('rotate_pivot')
        w = round(original_w * ratio)
        h = round(original_h * ratio)
        px = w * ratio_xy[0]
        py = h * (1 - ratio_xy[1])
        
        new_w = round(max(px, w - px) * 2)
        new_h = round(max(py, h - py) * 2)
        paste_x = round(new_w / 2 - px)
        paste_y = round(new_h / 2 - py)
        
        obj_data["pythonCalculations"]["mementosPivot"] = {
            "scaledSize": [w, h],
            "pivotScaled": [px, py],
            "expandedCanvas": [new_w, new_h],
            "pasteOffset": [paste_x, paste_y]
        }
        
        if abs(rot_deg) < 0.01:
            final_x = obj.get('position', [0, 0])[0] + paste_x + px
            final_y = obj.get('position', [0, 0])[1] + paste_y + py
            obj_data["pythonCalculations"]["mementosPivot"]["finalPosition"] = [final_x, final_y]
            obj_data["pythonCalculations"]["mementosPivot"]["hasRotation"] = False
        else:
            import math
            center_x = paste_x + px
            center_y = paste_y + py
            pil_angle_rad = math.radians(-rot_deg)
            cos = math.cos(pil_angle_rad)
            sin = math.sin(pil_angle_rad)
            
            canvas_corners = [
                [0, 0], [new_w, 0], [new_w, new_h], [0, new_h]
            ]
            
            rotated_corners = [
                [
                    (x - center_x) * cos - (y - center_y) * sin,
                    (x - center_x) * sin + (y - center_y) * cos
                ]
                for x, y in canvas_corners
            ]
            
            xs = [c[0] for c in rotated_corners]
            ys = [c[1] for c in rotated_corners]
            expanded_width = round(max(xs) - min(xs))
            expanded_height = round(max(ys) - min(ys))
            
            final_x = obj.get('position', [0, 0])[0] + expanded_width / 2
            final_y = obj.get('position', [0, 0])[1] + expanded_height / 2
            obj_data["pythonCalculations"]["mementosPivot"]["expandedSize"] = [expanded_width, expanded_height]
            obj_data["pythonCalculations"]["mementosPivot"]["finalPosition"] = [final_x, final_y]
            obj_data["pythonCalculations"]["mementosPivot"]["hasRotation"] = True
    
    output_data["objects"].append(obj_data)

# JSON 파일로 저장
output_file = "object-debug-python.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"\n디버그 정보가 {output_file} 파일로 저장되었습니다.")
