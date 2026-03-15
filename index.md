---
layout: default
title: I know a place - Find Remote Work Cafes & Study Spots
description: Find the perfect laptop-friendly cafes for remote work and studying. Discover spots with fast WiFi, power sockets, and great coffee on I know a place.
permalink: /
css: assets/css/landing.css, assets/css/carousel.css
---

<section class="landing-hero" aria-label="Hero">
  <div class="landing-hero-inner">
    <div class="landing-hero-content">
      <h1 class="landing-hero-title">
        Find your cafe to <span class="landing-hero-title-accent">work &amp; study</span>
      </h1>
      <p class="landing-hero-subtitle">Discover the perfect cafes with all the details you need. WiFi speed, power sockets, seating, and more—all in one app.</p>
      <a class="landing-hero-button" href="{{ site.app_store_url }}" target="_blank" rel="noopener" aria-label="Download on the App Store">
        Download on App Store
      </a>
      <p class="landing-hero-availability">✓ Available on iOS • Coming soon to Android</p>
    </div>
    <div class="landing-hero-image" aria-hidden="true">
      <img
        src="/assets/images/landing_phone.png"
        alt="App preview on phone"
        width="434"
        height="806"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
    </div>
  </div>
</section>

<section class="landing-carousel" aria-label="Featured remote work cafes" data-carousel>
  <div class="landing-carousel-heading">
    <h2 class="landing-carousel-title">Discover beautiful cafes for work and study</h2>
    <p class="landing-carousel-subtitle">Verified places with reliable WiFi where you can get your work done</p>
  </div>
  <div class="landing-carousel-inner">
    {% assign carousel_items = site.data.carousel %}

    <button class="carousel-nav carousel-prev" type="button" aria-label="Previous cafe" aria-controls="landing-carousel-viewport">
      <svg class="carousel-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="carousel-viewport" id="landing-carousel-viewport" aria-roledescription="carousel" aria-label="Gallery of featured cafes">
      <div class="carousel-track">
        {% for item in carousel_items %}
          <div class="carousel-slide">
            <figure class="carousel-media" data-cafe-slug="{{ item.slug | escape }}" style="margin: 0;">
              <img src="{{ item.image | relative_url }}" alt="Photo of {{ item.name }}, a laptop-friendly cafe in {{ item.city }}" loading="lazy" />
              <figcaption class="carousel-caption">
                <div class="carousel-caption-title">{{ item.name }}</div>
                <div class="carousel-caption-subtitle">{{ item.city }}</div>
              </figcaption>
            </figure>
          </div>
        {% endfor %}
      </div>
    </div>

    <button class="carousel-nav carousel-next" type="button" aria-label="Next image" aria-controls="landing-carousel-viewport">
      <svg class="carousel-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</section>

<section class="feature-section">
  <div class="feature-image">
    <img
      src="/assets/images/landing_page_coworking_avatar.png"
      alt="Person working comfortably on a laptop in a cafe"
      width="1027"
      height="1027"
      loading="lazy"
      decoding="async"
    />
  </div>
  <div class="feature-content">
    <h2>No more "Laptop Anxiety"</h2>
    <p>Do they allow laptops? Could I stay after I finish my coffee? Worry not, we provide all the information about whether you can stay all day!</p>
  </div>
</section>

<section class="feature-section reverse">
  <div class="feature-image">
    <img src="/assets/images/landing_page_wifi_speed.svg" alt="Illustration of fast reliable WiFi speed" />
  </div>
  <div class="feature-content">
    <h2>WiFi you can actually work with</h2>
    <p>"Free WiFi" doesn't always mean good WiFi. Access real-time, community-sourced speed tests for every location. Know if a spot is Zoom-ready before you even pack your bag.</p>
  </div>
</section>

<section class="feature-section">
  <div class="feature-image">
    <img src="/assets/images/landing_page_connect_button.svg" alt="One-tap WiFi connection button" />
  </div>
  <div class="feature-content">
    <h2>Connect WiFi in one tap. No questions asked</h2>
    <p>Skip the "Excuse me, what’s the password?" dance. Connect to the network instantly through the app and get straight to work.</p>
  </div>
</section>

<section class="feature-section reverse">
  <div class="feature-image">
    <img src="/assets/images/landing_page_amenities_list.svg" alt="List of cafe amenities like power outlets and AC"/>
  </div>
  <div class="feature-content">
    <h2>Everything Google Maps misses.</h2>
    <p>We track the details that matter: power outlet locations, air conditioning, and free water refills. Make an informed choice before you even leave the house.</p>
  </div>
</section>

<section class="social-proof-section" aria-label="Social proof">
  <div class="social-proof-inner">
    <h2 class="social-proof-title">Built by the community</h2>
    <p class="social-proof-subtitle">I know a place thrives on collaboration. Found a hidden gem? Share it with us, and we'll add it for everyone to enjoy. Help fellow remote workers and students discover their perfect workspace.</p>

    <div class="social-proof-stats" role="list" aria-label="Community stats">
      <div class="social-proof-stat" role="listitem">
        <div class="social-proof-stat-title">100+</div>
        <div class="social-proof-stat-subtitle">perfect cafes in major cities</div>
      </div>
      <div class="social-proof-stat" role="listitem">
        <div class="social-proof-stat-title">100%</div>
        <div class="social-proof-stat-subtitle">Verified Info</div>
      </div>
      <div class="social-proof-stat" role="listitem">
        <div class="social-proof-stat-title">24/7</div>
        <div class="social-proof-stat-subtitle">Updated Data</div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section" aria-label="Download call to action">
  <div class="cta-inner">
    <h2 class="cta-title">Ready to find your perfect cafe?</h2>
    <p class="cta-subtitle">Download I know a place now and discover the best cafes to work and study in your city.</p>
    <a class="cta-button" href="{{ site.app_store_url }}" target="_blank" rel="noopener" aria-label="Download I know a place on the App Store">
      Download on App Store
    </a>
    <p class="cta-footnote">Available on iOS • Coming soon to Android</p>
  </div>
</section>

