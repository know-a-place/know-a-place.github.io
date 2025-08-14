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
