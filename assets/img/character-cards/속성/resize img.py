from PIL import Image
import os

def resize_and_pad_image(input_path, output_path, size=60):
    """
    이미지를 비율 유지하며 해당 size로 리사이즈 후,
    투명 배경에 중앙 정렬하여 저장합니다.
    """
    with Image.open(input_path) as img:
        # 1) RGBA 모드로 변환(투명도 처리를 위해)
        img = img.convert("RGBA")
        
        # 2) 원본 가로/세로 비율 계산
        original_width, original_height = img.size
        ratio = min(size / original_width, size / original_height)
        
        # 3) 리사이즈할 최종 크기 계산 (비율 유지)
        new_width = int(original_width * ratio)
        new_height = int(original_height * ratio)
        
        # 4) 리사이즈 수행
        img = img.resize((new_width, new_height), Image.LANCZOS)
        
        # 5) 60×60 투명 배경(캔버스) 생성
        new_image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        
        # 6) 중앙 좌표 계산 (캔버스 중앙에 배치)
        paste_x = (size - new_width) // 2
        paste_y = (size - new_height) // 2
        
        # 7) 투명 캔버스에 리사이즈된 이미지 붙여넣기
        new_image.paste(img, (paste_x, paste_y))
        
        # 8) 최종 결과 저장
        new_image.save(output_path, "PNG")

if __name__ == "__main__":
    # 예시: 특정 폴더 내 모든 이미지 처리
    input_folder = "."
    output_folder = "./images_out"
    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".bmp")):
            input_file = os.path.join(input_folder, filename)
            output_file = os.path.join(output_folder, f"{os.path.splitext(filename)[0]}.png")
            
            resize_and_pad_image(input_file, output_file, size=60)
            print(f"Processed: {filename}")
