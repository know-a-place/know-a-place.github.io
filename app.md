---
layout: null
permalink: /app/location
sitemap: false
---
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>I know a place</title>
  <meta name="description" content="Find your next co-work cafe on I know a place." />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{{ '/assets/css/app.css' | relative_url }}" />
  <link rel="icon" type="image/png" sizes="32x32" href="{{ '/assets/favicons/favicon-32.png' | relative_url }}">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ '/assets/favicons/favicon-180.png' | relative_url }}">
  <script>
    window.__APP_STORE_URL__ = "{{ site.app_store_url }}";
    window.__API_BASE_URL__  = "{{ site.api_base_url }}";
  </script>
  <script>
    (function() {
      var m = window.location.pathname.match(/\/app\/location\/([^\/]+)/);
      var slug = m ? m[1] : new URLSearchParams(window.location.search).get('slug');
      if (slug) {
        var meta = document.createElement('meta');
        meta.name = 'apple-itunes-app';
        meta.content = 'app-id=6747653382, app-argument=https://iknowaplace.app/app/location/' + slug;
        document.head.appendChild(meta);
      }
    })();
  </script>
  <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="{{ '/assets/js/app.js' | relative_url }}" data-presets="react"></script>
</body>
</html>
