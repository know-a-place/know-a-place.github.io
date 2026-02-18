---
layout: default
title: Install
description: Install I know a place
permalink: /install/
---

<section class="page" style="max-width:820px;margin:4rem auto 5rem;padding:0 1.25rem;line-height:1.6;">
  <h1 style="font-size:clamp(2.2rem,5vw,3rem);line-height:1.1;margin:0 0 1.25rem;">Install “I know a place”</h1>

  <p>Looks like you opened a link that works best inside the app.</p>

  <p style="margin-top:1.25rem;">
    <strong>App Store link:</strong>
    <br />
    <span style="opacity:0.85;">Add your App Store URL here when ready.</span>
  </p>

  {% if page.url contains '/install/' and page.from %}
    <p style="opacity:0.85;">Trying to open: <code>{{ page.from }}</code></p>
  {% endif %}

  <h2 style="font-size:1.25rem;margin:2.5rem 0 0.75rem;">Need help?</h2>
  <p>Email us at <a href="mailto:{{ site.email }}">{{ site.email }}</a></p>
</section>

<script>
  // Optional: show where the user came from (for debugging/support)
  (function () {
    try {
      var params = new URLSearchParams(window.location.search);
      var from = params.get("from");
      if (!from) return;
      var p = document.createElement("p");
      p.style.opacity = "0.85";
      p.textContent = "Trying to open: " + from;
      var section = document.querySelector("section.page");
      if (section) section.appendChild(p);
    } catch (e) {}
  })();
</script>
