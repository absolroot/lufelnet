ruby '3.3.7'

source "https://rubygems.org"

gem 'bundler', '>= 2.4.22'
gem "jekyll", "~> 4.3.2"
gem "json"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag", "~> 2.7"
  gem "jekyll-sitemap"
  gem "jekyll-redirect-from"
end

gem "csv"
gem "base64"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]