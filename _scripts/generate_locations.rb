#!/usr/bin/env ruby
# Pre-build script: fetches live location data from the API and produces:
#
#   _data/locations.json              — full location list consumed by the footer
#   app/location/<slug>/index.html    — one SEO/deep-link page per location
#   app/locations/<city>/index.html   — last_modified_at kept current per city
#   app/locations/index.html          — last_modified_at kept current (all cities)
#
# Must run before `jekyll build` so Jekyll picks up the generated files.
#
# API base URL is resolved in this order:
#   1. API_BASE_URL environment variable  (used in CI)
#   2. api_base_url from _config.yml      (production default)
#   3. Hard-coded fallback                (safety net)
#
# last_modified_at behaviour:
#   - Location pages: preserved from the previous build when API data is
#     unchanged, updated to today only when data actually changes. This keeps
#     sitemap <lastmod> stable across rebuilds that fetch identical data.
#   - City index pages: set to the most recent last_modified_at among all
#     locations in that city, so the sitemap reflects real content changes.

require 'net/http'
require 'json'
require 'uri'
require 'fileutils'
require 'yaml'
require 'date'

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
city_dates = Hash.new { |h, k| h[k] = [] }
count = 0
locations.each do |location|
  slug = location['slug']
  next if slug.nil? || slug.strip.empty?

  dir = File.join('app', 'location', slug)
  FileUtils.mkdir_p(dir)

  path = File.join(dir, 'index.html')

  # Default to today. If the page already exists and its location data matches
  # the incoming data exactly, keep the existing date so the sitemap entry is
  # only updated when something actually changed.
  last_modified_at = Date.today.to_s
  if File.exist?(path)
    existing = YAML.safe_load(File.read(path)) rescue {}
    if existing.is_a?(Hash) && existing['location'] == location
      last_modified_at = existing['last_modified_at'] || last_modified_at
    end
  end

  front_matter = {
    'layout'           => 'location',
    'title'            => location['name'],
    'last_modified_at' => last_modified_at,
    'location'         => location,
  }

  File.write(path, "#{front_matter.to_yaml}---\n")
  count += 1

  # Collect dates by city for the index pages below.
  # address_city is normalised to a URL slug (e.g. "Ho Chi Minh City" → "ho-chi-minh-city")
  # to match the directory names under app/locations/.
  city_slug = location['address_city'].to_s.downcase.gsub(' ', '-')
  city_dates[city_slug] << last_modified_at unless city_slug.empty?
end

puts "LocationGenerator: generated #{count} location pages"

# ── City index pages ──────────────────────────────────────────
# Updates only the last_modified_at line in a page's front matter.
# Skips the write if the date hasn't changed to avoid unnecessary dirty files.
def update_city_last_modified(path, new_date)
  return unless File.exist?(path)
  content = File.read(path)
  updated = content.sub(/^last_modified_at:.*$/, "last_modified_at: #{new_date}")
  return if updated == content
  File.write(path, updated)
  puts "LocationGenerator: updated last_modified_at in #{path}"
end

# Per-city pages: use the latest date among that city's locations.
city_dates.each do |city_slug, dates|
  update_city_last_modified(File.join('app', 'locations', city_slug, 'index.html'), dates.max)
end

# All-cities index: use the latest date across every location.
all_max = city_dates.values.flatten.max
update_city_last_modified('app/locations/index.html', all_max) if all_max
