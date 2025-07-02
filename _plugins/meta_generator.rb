module Jekyll
  class MetaGenerator < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @meta_type = text.strip
    end

    def render(context)
      # 현재 페이지의 언어 감지
      page = context.registers[:page]
      site = context.registers[:site]
      
      # URL 파라미터에서 lang 추출
      detected_lang = extract_lang_from_url(page['url']) || page['language'] || 'kr'
      
      # 지원하지 않는 언어면 기본값으로
      unless site.data['i18n'] && site.data['i18n'][detected_lang]
        detected_lang = 'kr'
      end
      
      # 메타태그 타입에 따라 다른 출력
      case @meta_type
      when 'lang_detect'
        generate_lang_detection_script(detected_lang)
      when 'og_tags'
        generate_og_tags(site, page, detected_lang)
      when 'twitter_tags'
        generate_twitter_tags(site, page, detected_lang)
      else
        ''
      end
    end

    private

    def extract_lang_from_url(url)
      return nil unless url
      
      # URL에서 lang 파라미터 추출
      if url.include?('?')
        query_string = url.split('?').last
        params = query_string.split('&')
        
        params.each do |param|
          if param.start_with?('lang=')
            return param.split('=').last
          end
        end
      end
      
      nil
    end

    def generate_lang_detection_script(detected_lang)
      <<~JS
        <script>
          // 서버에서 감지된 언어
          window.serverDetectedLang = '#{detected_lang}';
          
          // 클라이언트에서 최종 언어 결정
          function getFinalLanguage() {
            // 1. URL 파라미터 우선
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            if (urlLang && ['kr', 'en', 'jp'].includes(urlLang)) {
              return urlLang;
            }
            
            // 2. 서버에서 IP 기반 감지된 언어
            if (window.serverDetectedLang) {
              return window.serverDetectedLang;
            }
            
            // 3. 브라우저 언어 감지
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('ja')) return 'jp';
            if (browserLang.startsWith('ko')) return 'kr';
            
            // 4. 기본값
            return 'kr';
          }
          
          window.currentLang = getFinalLanguage();
        </script>
      JS
    end

    def generate_og_tags(site, page, lang)
      i18n_data = site.data['i18n'][lang] || site.data['i18n']['kr']
      site_data = i18n_data['site'] || {}
      
      title = page['title'] || site_data['title'] || 'P5X 루페르넷'
      description = site_data['description'] || 'P5X 공략 및 정보 사이트'
      site_name = site_data['title'] || 'P5X 루페르넷'
      
      # 언어별 locale 설정
      locale = case lang
               when 'en' then 'en_US'
               when 'jp' then 'ja_JP'
               else 'ko_KR'
               end
      
      url = "#{site.config['url']}#{page['url']}"
      image_url = "#{site.config['url']}#{site.config['baseurl']}/assets/img/home/seo.png"
      
      <<~HTML
        <!-- Open Graph 메타 태그 (#{lang}) -->
        <meta property="og:title" content="#{title}">
        <meta property="og:description" content="#{description}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="#{url}">
        <meta property="og:image" content="#{image_url}">
        <meta property="og:site_name" content="#{site_name}">
        <meta property="og:locale" content="#{locale}">
      HTML
    end

    def generate_twitter_tags(site, page, lang)
      i18n_data = site.data['i18n'][lang] || site.data['i18n']['kr']
      site_data = i18n_data['site'] || {}
      
      title = page['title'] || site_data['title'] || 'P5X 루페르넷'
      description = site_data['description'] || 'P5X 공략 및 정보 사이트'
      image_url = "#{site.config['url']}#{site.config['baseurl']}/assets/img/home/seo.png"
      
      <<~HTML
        <!-- Twitter 카드 메타 태그 (#{lang}) -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="#{title}">
        <meta name="twitter:description" content="#{description}">
        <meta name="twitter:image" content="#{image_url}">
      HTML
    end
  end
end

Liquid::Template.register_tag('meta_gen', Jekyll::MetaGenerator) 