(function(){
  const header = document.querySelector('[data-mobile-nav]');
  if(!header) return;
  const btn = header.querySelector('.hamburger');
  const nav = header.querySelector('.main-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(open){
      // trap focus start at first link
      const firstLink = nav.querySelector('.nav-link');
      firstLink && firstLink.focus({preventScroll:true});
    }
  });
  // Close on escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && btn.classList.contains('is-open')){
      btn.click();
    }
  });
})();

(function(){
  const carousels = document.querySelectorAll('[data-carousel]');
  if(!carousels.length) return;

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    if(!viewport || !track || !prev || !next) return;

    const originalSlides = Array.from(track.querySelectorAll('.carousel-slide'));
    if(!originalSlides.length) return;
    if(originalSlides.length === 1) return;

    const cloneCount = originalSlides.length;
    const clonedBefore = originalSlides.slice(-cloneCount).map((s) => s.cloneNode(true));
    const clonedAfter = originalSlides.slice(0, cloneCount).map((s) => s.cloneNode(true));
    clonedBefore.slice().reverse().forEach((node) => track.insertBefore(node, track.firstChild));
    clonedAfter.forEach((node) => track.appendChild(node));

    let index = cloneCount;
    let stepPx = 0;
    let autoplayId = 0;
    let isSnapping = false;

    const setTransform = (animate) => {
      if (!stepPx) return;
      if (!animate) {
        isSnapping = true;
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(${-index * stepPx}px)`;
      if (!animate) {
        track.getBoundingClientRect();
        track.style.transition = '';
        isSnapping = false;
      }
    };

    const measure = () => {
      const firstSlide = track.querySelector('.carousel-slide');
      if(!firstSlide) return;
      const gap = parseFloat(getComputedStyle(track).gap || '0') || 0;
      const slideWidth = firstSlide.getBoundingClientRect().width;
      stepPx = slideWidth + gap;
    };

    const goNext = (animate = true) => {
      index += 1;
      setTransform(animate);
    };

    const goPrev = (animate = true) => {
      index -= 1;
      setTransform(animate);
    };

    track.addEventListener('transitionend', (e) => {
      if (isSnapping) return;
      if (e.propertyName && e.propertyName !== 'transform') return;
      const totalOriginal = originalSlides.length;
      let wrapped = false;
      while (index >= totalOriginal + cloneCount) {
        index -= totalOriginal;
        wrapped = true;
      }
      while (index < cloneCount) {
        index += totalOriginal;
        wrapped = true;
      }
      if (wrapped) setTransform(false);
    });

    const startAutoplay = () => {
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;
      if (autoplayId) return;
      autoplayId = window.setInterval(() => {
        measure();
        goNext(true);
      }, 3500);
    };

    const stopAutoplay = () => {
      if (!autoplayId) return;
      window.clearInterval(autoplayId);
      autoplayId = 0;
    };

    // Allow normal page scrolling (wheel/touch) while hovering the carousel.

    prev.addEventListener('click', () => {
      stopAutoplay();
      measure();
      goPrev(true);
      startAutoplay();
    });
    next.addEventListener('click', () => {
      stopAutoplay();
      measure();
      goNext(true);
      startAutoplay();
    });

    window.addEventListener('resize', () => {
      measure();
      setTransform(false);
    });

    measure();
    setTransform(false);
    startAutoplay();
  });
})();
