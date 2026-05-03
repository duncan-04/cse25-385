(() => {
  const nav       = document.getElementById('nav');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobileDrawer');
  const bc        = document.getElementById('breadcrumb');
  const bcSection = document.getElementById('bc-section');
  const bcItem    = document.getElementById('bc-item');
  const bcSep2    = document.getElementById('bc-sep2');

  let activeMenu = null;
  let drawerOpen = false;

  /* scroll effect */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* close all megas */
  function closeAll() {
    document.querySelectorAll('.mega-menu').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('[data-trigger]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    document.querySelectorAll('.nav-links > li').forEach(li => li.classList.remove('active'));
    overlay.classList.remove('visible');
    activeMenu = null;
  }

  /* open a mega */
  function openMega(key) {
    if (activeMenu === key) { closeAll(); return; }
    closeAll();
    activeMenu = key;
    const menu = document.getElementById('mega-' + key);
    if (!menu) return;
    menu.classList.add('open');
    overlay.classList.add('visible');
    document.querySelectorAll(`[data-trigger="${key}"]`).forEach(b => {
      b.setAttribute('aria-expanded', 'true');
      b.closest('li')?.classList.add('active');
    });
  }

  /* desktop trigger clicks */
  document.querySelectorAll('.nav-link[data-trigger]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openMega(btn.dataset.trigger);
    });
  });

  /* overlay click → close */
  overlay.addEventListener('click', closeAll);

  /* escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeAll(); closeDrawer(); }
  });

  /* hamburger */
  function openDrawer() {
    drawerOpen = true;
    drawer.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerOpen = false;
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawerOpen ? closeDrawer() : openDrawer();
  });

  /* mobile accordion */
  document.querySelectorAll('.mob-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.mob;
      const sub = document.getElementById('mob-' + key);
      const isOpen = sub.classList.contains('open');
      document.querySelectorAll('.mob-sub').forEach(s => s.classList.remove('open'));
      document.querySelectorAll('.mob-trigger').forEach(b => b.classList.remove('open'));
      if (!isOpen) {
        sub.classList.add('open');
        btn.classList.add('open');
      }
    });
  });

  /* close drawer on link click */
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });

  /* three-click breadcrumb */
  document.querySelectorAll('.mega-links a').forEach(link => {
    link.addEventListener('click', e => {
      const section = link.closest('.mega-menu')?.dataset.menu;
      const label   = link.textContent.trim().replace(/[›»]/, '').trim();
      if (section) {
        const sectionLabel = { about: 'About Us', products: 'Products & Services', technology: 'Technology' }[section] || section;
        bcSection.textContent = sectionLabel;
        bcItem.textContent    = label;
        bcItem.style.display  = 'inline';
        bcSep2.style.display  = 'inline';
        bc.classList.add('visible');
        setTimeout(() => bc.classList.remove('visible'), 3500);
      }
      closeAll();
    });
  });

  /* click outside to close */
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !document.querySelector('.mega-menu.open')?.contains(e.target)) {
      closeAll();
    }
  });
})();
