/* ============================================================
   PowerUp Batteries — Enhanced Interactive script.js
   ============================================================ */


/* ============================================================
   1. ACTIVE NAVIGATION
   ============================================================ */
function setActiveNav() {

  const currentPage = window.location.pathname.split('/').pop();

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');

    const href = link.getAttribute('href');

    if (href === currentPage) {
      link.classList.add('active');
    }
  });

}


/* ============================================================
   2. CART SYSTEM
   ============================================================ */

// GET CART
function getCart() {
  return JSON.parse(localStorage.getItem('powerup_cart') || '[]');
}

// SAVE CART
function saveCart(cart) {
  localStorage.setItem('powerup_cart', JSON.stringify(cart));
}

// ADD TO CART + AUTO REDIRECT
function addToCart(name, price, image = '') {

  const cart = getCart();

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      name: name,
      price: price,
      qty: 1,
      image: image
    });
  }

  saveCart(cart);

  updateCartBadge();

  showToast(name + ' added to cart');

  // SMALL DELAY BEFORE REDIRECT
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 1200);
}


// REMOVE ITEM
function removeFromCart(name) {

  let cart = getCart();

  cart = cart.filter(item => item.name !== name);

  saveCart(cart);

  renderCart();

  updateCartBadge();

  showToast('Item removed');

}


// UPDATE CART BADGE
function updateCartBadge() {

  const badge = document.getElementById('cart-badge');

  if (!badge) return;

  const cart = getCart();

  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  badge.textContent = total;

  badge.style.display = total > 0 ? 'inline-flex' : 'none';

}


// RENDER CART
function renderCart() {

  const list = document.getElementById('cart-items-list');

  if (!list) return;

  const cart = getCart();

  list.innerHTML = '';

  let subtotal = 0;

  if (cart.length === 0) {

    list.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Add products from the shop page.</p>
      </div>
    `;

    return;
  }

  cart.forEach(item => {

    subtotal += item.price * item.qty;

    const row = document.createElement('div');

    row.className = 'cart-item-row';

    row.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.qty}</p>
      </div>

      <div class="cart-item-price">
        $${(item.price * item.qty).toLocaleString()}
      </div>

      <button class="remove-btn"
        onclick="removeFromCart('${item.name}')">
        ✕
      </button>
    `;

    list.appendChild(row);

  });

  // TOTALS
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  const shipping = 50;

  const total = subtotal + shipping;

  if (subtotalEl) {
    subtotalEl.textContent =
      '$' + subtotal.toLocaleString(undefined, {
        minimumFractionDigits: 2
      });
  }

  if (totalEl) {
    totalEl.textContent =
      '$' + total.toLocaleString(undefined, {
        minimumFractionDigits: 2
      });
  }

}


// CLEAR CART
function clearCart() {

  localStorage.removeItem('powerup_cart');

  renderCart();

  updateCartBadge();

  showToast('Cart cleared');

}


// CHECKOUT
function checkout() {

  const cart = getCart();

  if (cart.length === 0) {

    showToast('Your cart is empty');

    return;
  }

  showToast('Redirecting to payment');

  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 1200);

}


/* ============================================================
   3. CONTACT FORM
   ============================================================ */
function submitContact() {

  const name = document.getElementById('contact-name').value.trim();

  const email = document.getElementById('contact-email').value.trim();

  const message = document.getElementById('contact-msg').value.trim();

  if (!name || !email || !message) {

    showToast('Please complete all fields');

    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {

    showToast('Please enter a valid email');

    return;
  }

  showToast('Message sent successfully');

  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-msg').value = '';

}


/* ============================================================
   4. WALLET PAGE
   ============================================================ */

// CARD FORMAT
function formatCard(input) {

  let value = input.value.replace(/\D/g, '');

  value = value.substring(0, 16);

  input.value = value.replace(/(.{4})/g, '$1 ').trim();

}


// EXPIRY FORMAT
function formatExpiry(input) {

  let value = input.value.replace(/\D/g, '');

  value = value.substring(0, 4);

  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  }

  input.value = value;

}


// CVV ONLY
function numbersOnly(input) {

  input.value = input.value.replace(/\D/g, '');

}


// SAVE CARD
function saveCard() {

  const name = document.getElementById('w-name').value.trim();

  const number = document.getElementById('w-number').value.trim();

  const expiry = document.getElementById('w-expiry').value.trim();

  const cvv = document.getElementById('w-cvv').value.trim();

  if (!name || !number || !expiry || !cvv) {

    showToast('Please complete card details');

    return;
  }

  showToast('Card saved successfully');

}


/* ============================================================
   5. SCROLL ANIMATIONS
   ============================================================ */

function revealOnScroll() {

  const reveals = document.querySelectorAll(
    '.offer-card, .tech-stat, .tech-feature-item, .shop-item, .cat-card'
  );

  reveals.forEach(item => {

    const windowHeight = window.innerHeight;

    const top = item.getBoundingClientRect().top;

    if (top < windowHeight - 100) {
      item.classList.add('reveal-active');
    }

  });

}


/* ============================================================
   6. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message) {

  let toast = document.getElementById('toast');

  if (!toast) {

    toast = document.createElement('div');

    toast.id = 'toast';

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);

}


/* ============================================================
   7. SHOP FILTER (OPTIONAL)
   ============================================================ */
function searchProducts() {

  const input = document.getElementById('shop-search');

  if (!input) return;

  const filter = input.value.toLowerCase();

  const products = document.querySelectorAll('.shop-item');

  products.forEach(product => {

    const text = product.innerText.toLowerCase();

    product.style.display =
      text.includes(filter) ? 'grid' : 'none';

  });

}


/* ============================================================
   8. PAGE LOADER
   ============================================================ */

window.addEventListener('load', () => {

  document.body.classList.add('loaded');

});


/* ============================================================
   9. INITIALIZE EVERYTHING
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  setActiveNav();

  updateCartBadge();

  renderCart();

  revealOnScroll();

  window.addEventListener('scroll', revealOnScroll);

});
