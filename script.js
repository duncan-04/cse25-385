/* ═══════════════════════════════════════════════════════════════════
   POWERUP BATTERIES — Global JavaScript (script.js)
   Shared across all pages
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── UTILITIES ────────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── NAV: scroll state ────────────────────────────────────────── */
  const nav = $('#mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── NAV: active link ─────────────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── NAV: hamburger toggle ────────────────────────────────────── */
  const toggle = $('#navToggle');
  const navLinks = $('#navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* ── THREE-CLICK RULE: mobile dropdown toggle ─────────────────── */
  $$('.nav-links .has-dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        const li = link.closest('li');
        li.classList.toggle('open');
      }
    });
  });

  /* ── HERO: IntersectionObserver for slow zoom ─────────────────── */
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.25 });
  $$('.hero-section').forEach(s => heroObserver.observe(s));

  /* ── SCROLL REVEAL ────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  /* ── VIDEO BLOCK: click-to-alert placeholder ──────────────────── */
  $$('.video-block').forEach(vb => {
    vb.addEventListener('click', () => {
      // Replace this with real video embed logic
      alert('Video player — add your video URL here.');
    });
  });

  /* ── CART COUNT (localStorage) ────────────────────────────────── */
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('pu_cart') || '[]');
    const badge = $('#cartCount');
    if (badge) {
      const qty = cart.reduce((s, i) => s + (i.qty || 1), 0);
      badge.textContent = qty;
      badge.style.display = qty ? 'flex' : 'none';
    }
  }
  updateCartBadge();

  /* ── SHOP: Add to Cart ────────────────────────────────────────── */
  $$('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.id;
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price || 0);
      const cart  = JSON.parse(localStorage.getItem('pu_cart') || '[]');
      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }
      localStorage.setItem('pu_cart', JSON.stringify(cart));
      updateCartBadge();
      // Brief button feedback
      const orig = btn.textContent;
      btn.textContent = '✓ Added';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1400);
    });
  });

  /* ── CART PAGE: render ────────────────────────────────────────── */
  const cartList   = $('#cartItems');
  const cartEmpty  = $('#cartEmpty');
  const subtotalEl = $('#cartSubtotal');
  const totalEl    = $('#cartTotal');

  function renderCart() {
    if (!cartList) return;
    const cart = JSON.parse(localStorage.getItem('pu_cart') || '[]');
    cartList.innerHTML = '';
    if (cart.length === 0) {
      if (cartEmpty)  cartEmpty.style.display = 'flex';
      if (cartList)   cartList.style.display  = 'none';
    } else {
      if (cartEmpty)  cartEmpty.style.display = 'none';
      if (cartList)   cartList.style.display  = 'block';
      let sub = 0;
      cart.forEach((item, idx) => {
        sub += item.price * (item.qty || 1);
        const row = document.createElement('div');
        row.className = 'cart-row';
        row.innerHTML = `
          <div class="cart-row-info">
            <span class="cart-row-name">${item.name}</span>
            <span class="cart-row-price">$${item.price.toFixed(2)} × ${item.qty || 1}</span>
          </div>
          <div class="cart-row-actions">
            <span class="cart-row-total">$${(item.price * (item.qty || 1)).toFixed(2)}</span>
            <button class="cart-remove" data-idx="${idx}" aria-label="Remove item">✕</button>
          </div>`;
        cartList.appendChild(row);
      });
      if (subtotalEl) subtotalEl.textContent = '$' + sub.toFixed(2);
      if (totalEl)    totalEl.textContent    = '$' + (sub + 50).toFixed(2);
    }
    // bind remove buttons
    $$('.cart-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = JSON.parse(localStorage.getItem('pu_cart') || '[]');
        c.splice(parseInt(btn.dataset.idx), 1);
        localStorage.setItem('pu_cart', JSON.stringify(c));
        renderCart();
        updateCartBadge();
      });
    });
  }
  renderCart();

  /* ── WALLET: card form ────────────────────────────────────────── */
  const walletForm = $('#walletForm');
  const cardPreview = $('#cardPreview');
  if (walletForm) {
    const cardName   = walletForm.querySelector('[name="cardName"]');
    const cardNumber = walletForm.querySelector('[name="cardNumber"]');
    const cardExpiry = walletForm.querySelector('[name="cardExpiry"]');
    const cardCvv    = walletForm.querySelector('[name="cardCvv"]');
    const previewName   = $('#previewName');
    const previewNumber = $('#previewNumber');
    const previewExpiry = $('#previewExpiry');

    // format card number: groups of 4
    if (cardNumber) {
      cardNumber.addEventListener('input', () => {
        let v = cardNumber.value.replace(/\D/g,'').substring(0,16);
        cardNumber.value = v.replace(/(.{4})/g,'$1 ').trim();
        if (previewNumber) previewNumber.textContent = (cardNumber.value || '•••• •••• •••• ••••');
      });
    }
    if (cardExpiry) {
      cardExpiry.addEventListener('input', () => {
        let v = cardExpiry.value.replace(/\D/g,'').substring(0,4);
        if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
        cardExpiry.value = v;
        if (previewExpiry) previewExpiry.textContent = v || 'MM/YY';
      });
    }
    if (cardName) {
      cardName.addEventListener('input', () => {
        if (previewName) previewName.textContent = cardName.value.toUpperCase() || 'CARD HOLDER';
      });
    }
    // flip on CVV focus
    if (cardCvv && cardPreview) {
      cardCvv.addEventListener('focus',  () => cardPreview.classList.add('flipped'));
      cardCvv.addEventListener('blur',   () => cardPreview.classList.remove('flipped'));
    }
    walletForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Card saved successfully!');
    });
  }

  /* ── PAYMENT: accordion ───────────────────────────────────────── */
  $$('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');
      // close all
      $$('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
  // open first by default
  const firstAccordion = $('.accordion-item');
  if (firstAccordion) {
    firstAccordion.classList.add('open');
    const body = firstAccordion.querySelector('.accordion-body');
    if (body) body.style.maxHeight = body.scrollHeight + 'px';
  }

  /* ── CONTACT FORM ─────────────────────────────────────────────── */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sent ✓';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; contactForm.reset(); }, 2400);
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────────── */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
