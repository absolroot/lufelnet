require 'resolv'

module Jekyll
  class GeoDetector < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      # 서버 환경에서 클라이언트 IP 감지
      request = context.registers[:request] if context.registers[:request]
      
      if request
        # Nginx나 프록시를 통한 실제 IP 감지
        client_ip = request.env['HTTP_X_FORWARDED_FOR'] || 
                   request.env['HTTP_X_REAL_IP'] || 
                   request.env['REMOTE_ADDR'] || 
                   '127.0.0.1'
        
        # 첫 번째 IP만 사용 (프록시 체인의 경우)
        client_ip = client_ip.split(',').first.strip if client_ip.include?(',')
        
        # IP 기반 지역 감지 (간단한 예시)
        detected_lang = detect_language_by_ip(client_ip)
        
        # JavaScript로 클라이언트에서 사용할 수 있도록 변수 설정
        <<~JS
          <script>
            window.detectedLang = '#{detected_lang}';
            window.clientIP = '#{client_ip}';
          </script>
        JS
      else
        # 빌드 타임에는 기본값 사용
        <<~JS
          <script>
            window.detectedLang = 'kr';
            window.clientIP = 'unknown';
          </script>
        JS
      end
    end

    private

    def detect_language_by_ip(ip)
      return 'kr' if ip == '127.0.0.1' || ip.start_with?('192.168.') || ip.start_with?('10.')
      
      # 간단한 IP 범위 기반 지역 감지 (실제로는 GeoIP 데이터베이스 사용 권장)
      # 일본 IP 범위 예시 (일부)
      japanese_ranges = [
        '133.', '210.', '202.', '219.', '220.', '221.', '222.', '211.'
      ]
      
      # 한국 IP 범위 예시 (일부)  
      korean_ranges = [
        '1.', '14.', '27.', '39.', '58.', '59.', '61.', '106.', '112.', '113.', '114.', '115.', '116.', '117.', '118.', '119.', '121.', '122.', '123.', '124.', '125.', '168.', '175.', '180.', '182.', '183.', '203.'
      ]
      
      japanese_ranges.each do |range|
        return 'jp' if ip.start_with?(range)
      end
      
      korean_ranges.each do |range|
        return 'kr' if ip.start_with?(range)
      end
      
      # 기타 지역은 영어
      'en'
    end
  end
end

Liquid::Template.register_tag('geo_detect', Jekyll::GeoDetector) 