#!/usr/bin/env ruby
# Fetches all locations from the API and writes:
#   - _data/locations.json          (for the footer)
#   - app/location/<slug>/index.html (one SEO page per location)
# Run before `jekyll build` so Jekyll processes the generated files normally.

require 'net/http'
require 'json'
require 'uri'
require 'fileutils'
require 'yaml'

_config  = YAML.safe_load(File.read('_config.yml')) rescue {}
API_BASE = ENV.fetch('API_BASE_URL', _config['api_base_url'] || 'https://api.iknowaplace.app')

uri      = URI("#{API_BASE}/api/v1/locations/webapp")
http     = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'
response = http.get(uri.request_uri)

abort "LocationGenerator: API returned #{response.code}" unless response.is_a?(Net::HTTPSuccess)

locations = JSON.parse(response.body)

# ── Footer data ───────────────────────────────────────────────
FileUtils.mkdir_p('_data')
File.write('_data/locations.json', JSON.pretty_generate(locations))
puts "LocationGenerator: wrote _data/locations.json (#{locations.size} locations)"

# ── Per-location pages ────────────────────────────────────────
count = 0
locations.each do |location|
  slug = location['slug']
  next if slug.nil? || slug.strip.empty?

  dir = File.join('app', 'location', slug)
  FileUtils.mkdir_p(dir)

  front_matter = {
    'layout'   => 'location',
    'title'    => location['name'],
    'location' => location,
  }

  File.write(File.join(dir, 'index.html'), "#{front_matter.to_yaml}---\n")
  count += 1
end

puts "LocationGenerator: generated #{count} location pages"
