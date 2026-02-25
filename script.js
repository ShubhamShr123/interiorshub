// Mobile nav toggle
function initNavToggle(){
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');

  if(!btn || !nav) return;

  function toggleNav(){
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if(!isOpen){
      document.querySelectorAll('.dropdown.open').forEach(function(dd){
        dd.classList.remove('open');
        const pdb = dd.querySelector('.dropbtn');
        if(pdb) pdb.setAttribute('aria-expanded','false');
      });
    }
  }

  btn.addEventListener('click', toggleNav);

  // Close when a nav link is clicked (mobile)
  nav.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.querySelectorAll('.dropdown.open').forEach(function(dd){
        dd.classList.remove('open');
        const pdb = dd.querySelector('.dropbtn');
        if(pdb) pdb.setAttribute('aria-expanded','false');
      });
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.querySelectorAll('.dropdown.open').forEach(function(dd){
        dd.classList.remove('open');
        const pdb = dd.querySelector('.dropbtn');
        if(pdb) pdb.setAttribute('aria-expanded','false');
      });
    }
  });

  // Dropdown toggle for mobile / keyboard
  const dropButtons = document.querySelectorAll('.dropbtn');
  dropButtons.forEach(function(dbtn){
    dbtn.addEventListener('click', function(e){
      const parent = dbtn.closest('.dropdown');
      if(!parent) return;
      const isOpen = parent.classList.toggle('open');
      dbtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      e.stopPropagation();
    });
  });

  // close dropdowns when clicking outside
  document.addEventListener('click', function(e){
    document.querySelectorAll('.dropdown.open').forEach(function(dd){
      if(!dd.contains(e.target)){
        dd.classList.remove('open');
        const btn = dd.querySelector('.dropbtn');
        if(btn) btn.setAttribute('aria-expanded','false');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavToggle);
} else {
  initNavToggle();
}

// Heading magnifier: reveal an inverted-color copy of a heading inside a circular lens that follows the cursor
function initHeadingMagnifier(){
  // only run on pointer-capable devices (desktop or stylus) to avoid interfering with touch scrolling
  if(!window.matchMedia('(pointer: fine)').matches) return;
  const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');

  // create a single page-level portal for the lens so it won't be clipped by heading bounds
  let portal = document.querySelector('.heading-lens-portal');
  if(!portal){
    portal = document.createElement('div');
    portal.className = 'heading-lens-portal';
    portal.innerHTML = '<div class="lens"></div>';
    document.body.appendChild(portal);
  }
  const lens = portal.querySelector('.lens');
  headings.forEach(function(h){
    // skip if already processed
    if(h.classList.contains('heading-magnet')) return;

    const html = h.innerHTML;
    // wrap content in original and clone spans
    h.innerHTML = '<span class="original">' + html + '</span><span class="clone" aria-hidden="true">' + html + '</span>';
    h.classList.add('heading-magnet');

    // compute an appropriate radius based on heading height
    const rect = h.getBoundingClientRect();
    // smaller, tighter lens: use 0.7x heading height with a smaller minimum
    const r = Math.max(28, Math.round(rect.height * 0.7));
    h.style.setProperty('--r', r + 'px');

    // the clone will use CSS-defined colors (white text on black background)

    // interaction handlers
    // use portal lens: position the portal over the heading and update clip position
    function onMove(e){
      const evt = (e.touches && e.touches[0]) || e;
      const rct = h.getBoundingClientRect();
      const x = Math.max(0, Math.min(rct.width, evt.clientX - rct.left));
      const y = Math.max(0, Math.min(rct.height, evt.clientY - rct.top));
      // set portal CSS variables relative to the portal's coordinate space (we position portal at heading rect)
      portal.style.setProperty('--mx', x + 'px');
      portal.style.setProperty('--my', y + 'px');
    }

    function enter(e){
      // populate portal with heading's content and style
      const computed = window.getComputedStyle(h);
      lens.innerHTML = h.innerHTML;
      // copy basic font/size/weight/line-height so the overlay matches
      lens.style.font = computed.font || computed.fontSize + ' ' + computed.fontFamily;
      lens.style.fontSize = computed.fontSize;
      lens.style.fontWeight = computed.fontWeight;
      lens.style.lineHeight = computed.lineHeight;
      lens.style.letterSpacing = computed.letterSpacing;
      lens.style.padding = computed.padding;
      lens.style.margin = '0';
      // position portal exactly over the heading
      const rct = h.getBoundingClientRect();
      portal.style.left = rct.left + 'px';
      portal.style.top = rct.top + 'px';
      portal.style.width = rct.width + 'px';
      portal.style.height = rct.height + 'px';
      portal.style.setProperty('--r', (h.style.getPropertyValue('--r') || '40px'));
      portal.classList.add('visible');
      onMove(e);
    }

    function leave(){
      portal.classList.remove('visible');
    }

    h.addEventListener('mousemove', onMove);
    h.addEventListener('mouseenter', enter);
    h.addEventListener('mouseleave', leave);
    // touch support (optional) — show lens on touchmove
    h.addEventListener('touchmove', function(e){ enter(e); onMove(e); }, {passive:true});
    h.addEventListener('touchend', function(){ leave(); });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeadingMagnifier);
} else {
  initHeadingMagnifier();
}
