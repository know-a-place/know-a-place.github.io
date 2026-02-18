# IKnowAPlace — Local development

Short instructions to run this Jekyll-based site locally.

## Prerequisites
- Ruby (macOS: `brew install ruby`)
- Bundler: `gem install bundler`
- (Optional) Docker

## Install dependencies
Run from the project root (where the `Gemfile` lives):

```bash
bundle install
```

## Run the site locally (development)
Start Jekyll's dev server with live reload:
w
```bash
bundle exec jekyll serve --livereload
```

This serves the site at `http://127.0.0.1:4000` by default. Source files are at the project root (`index.html`, `_includes/`, `_layouts/`, `_posts/`); the generated static site is in `_site/`.

## Build and serve the static output
Build the site to `_site`:

```bash
bundle exec jekyll build
```

Then serve the built site (example using Python 3):

```bash
python3 -m http.server 4000 --directory _site
```

## Docker (optional)
Run with the official Jekyll image (bind mounts the current directory):

```bash
docker run --rm -it -v "$PWD":/srv/jekyll -p 4000:4000 jekyll/jekyll:4 jekyll serve --watch
```

## Notes & troubleshooting
- If `bundle install` or `jekyll` commands fail, try `gem install jekyll bundler`.
- If macOS has Ruby path issues, follow Homebrew instructions shown after `brew install ruby` to update your shell PATH.

---
Created to help run this project locally. If you want, I can also add a `Procfile` or a small npm script to simplify commands.
