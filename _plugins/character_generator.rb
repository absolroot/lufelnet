require 'json'

module Jekyll
  class CharacterGenerator < Generator
    safe true
    priority :high

    def generate(site)
      puts "캐릭터 테스트 페이지 생성 시작..."

      begin
        # character.html 템플릿 읽기
        template_path = File.join(site.source, 'kr', 'character', 'character.html')
        puts "템플릿 파일 읽기: #{template_path}"
        
        template = File.read(template_path)
        template_content = template.split(/---\n/)[2] # YAML 프론트매터 제거

        # characters.js 파일 경로
        js_path = File.join(site.source, 'data', 'kr', 'characters', 'characters.js')
        
        # characters.js 파일이 존재하는지 확인
        if File.exist?(js_path)
          puts "characters.js 파일 발견: #{js_path}"
          
          # characterData 객체에서 캐릭터 이름 목록 추출
          js_content = File.read(js_path)
          
          # characterData = { 다음부터 마지막 }; 까지의 내용을 가져옴
          character_data = js_content.match(/characterData\s*=\s*({[\s\S]*?});/)[1]
          
          # 최상위 레벨의 캐릭터 이름만 추출
          # 1. 중괄호의 깊이를 추적하여 최상위 레벨의 키만 찾음
          # 2. minimum_stats는 제외
          depth = 0
          character_names = []
          current_name = nil
          
          character_data.each_line do |line|
            # 키 찾기 (depth가 0일 때만)
            if depth == 0
              if match = line.match(/^\s*['"]([^'"]+)['"]\s*:\s*{/)
                current_name = match[1]
                depth += 1
              end
            else
              # 중괄호 깊이 추적
              depth += line.count('{')
              depth -= line.count('}')
              
              # depth가 0이 되면 하나의 객체가 끝난 것
              if depth == 0 && current_name && current_name != 'minimum_stats'
                character_names << current_name
                current_name = nil
              end
            end
          end
          
          puts "발견된 캐릭터 수: #{character_names.length}"
          
          # 각 캐릭터에 대해 테스트 페이지 생성
          character_names.each do |name|
            puts "캐릭터 테스트 페이지 생성 중: #{name}"
            
            # 페이지 생성
            page = Jekyll::PageWithoutAFile.new(site, site.source, "test/character/#{name}", "index.html")
            
            # 페이지 속성 설정
            page.data.merge!({
              'layout' => 'default',
              'title' => "#{name} - 테스트 페이지",
              'name' => name,
              'language' => 'kr',
              'custom_css' => ['cha_detail'],
              'custom_js' => ['cha_detail', 'tooltip', 'detail/dot-carousel'],
              'custom_data' => [
                'characters/characters.js',
                'revelations/revelations.js',
                'characters/character_ritual.js',
                'characters/character_skills.js',
                'characters/character_weapon.js',
                'tooltip.js'
              ]
            })
            
            # 페이지 내용 설정
            page.content = template_content
            
            # 사이트에 페이지 추가
            site.pages << page
          end

          puts "캐릭터 테스트 페이지 생성 완료!"
        else
          puts "characters.js 파일을 찾을 수 없습니다: #{js_path}"
        end
      rescue => e
        puts "에러 발생: #{e.message}"
        puts e.backtrace
      end
    end
  end
end 