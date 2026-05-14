/* ============================================================
   PowerUp Batteries — script.js
   Place this file in the SAME folder as all your HTML files
   Link it in every HTML page just before the closing </body> tag:
   <script src="script.js"></script>
   ============================================================ */


/* ============================================================
   1. NAVIGATION — highlight the active nav link
      Used on: ALL pages
      How it works: reads the current filename and bolds
      the matching nav <a> tag automatically
   ============================================================ */
function setActiveNav() {
  // Get the current page filename e.g. "about.html"
  const currentPage = window.location.pathname.split('/').pop();

  // Map each filename to its nav link id
  const navMap = {
    'index.html':    'nav-home',
    'about.html':    'nav-about',
    'products.html': 'nav-products',
    'technology.html':'nav-technology',
    'shop.html':     'nav-shop',
    'cart.html':     'nav-cart',
    'wallet.html':   'nav-wallet',
    'payment.html':  'nav-payment',
    'contact.html':  'nav-contact',
  };

  const activeId = navMap[currentPage];
  if (activeId) {
    const activeLink = document.getElementById(activeId);
    if (activeLink) activeLink.classList.add('active');
  }
}


/* ============================================================
   2. CART — stored in localStorage so it persists across pages
      Used on: shop.html (add), cart.html (read/render)
   ============================================================ */

// --- Get cart from localStorage ---
function getCart() {
  return JSON.parse(localStorage.getItem('powerup_cart') || '[]');
}

// --- Save cart to localStorage ---
function saveCart(cart) {
  localStorage.setItem('powerup_cart', JSON.stringify(cart));
}

// --- Add item to cart (called by Shop Now buttons on shop.html) ---
function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(name + ' added to cart!');
}

// --- Remove item from cart (called by × buttons on cart.html) ---
function removeFromCart(name) {
  let cart = getCart();
  cart = cart.filter(i => i.name !== name);
  saveCart(cart);
  renderCart();   // re-render the cart page
  updateCartBadge();
}

// --- Update cart item count badge on the nav Cart link ---
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = total > 0 ? total : '';
    badge.style.display = total > 0 ? 'inline-block' : 'none';
  }
}

// --- Render cart items on cart.html ---
function renderCart() {
  // Only runs if these elements exist (i.e. we are on cart.html)
  const list       = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl    = document.getElementById('cart-total');
  const shopNote   = document.getElementById('shop-note');

  if (!list) return; // not on cart.html, do nothing

  const cart = getCart();
  list.innerHTML = '';
  let subtotal = 0;

  if (cart.length === 0) {
    // Show empty state, reset totals
    if (emptyState) emptyState.style.display = 'flex';
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (totalEl)    totalEl.textContent    = '$0.00';
    if (shopNote)   shopNote.style.display = 'block';
    return;
  }

  // Hide empty state
  if (emptyState) emptyState.style.display = 'none';
  if (shopNote)   shopNote.style.display   = 'none';

  // Build a row for each item
  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-thumb"></div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="cart-item-qty">Qty: ${item.qty}</span>
      </div>
      <div class="cart-item-price">
        $${(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
      <button class="remove-btn" onclick="removeFromCart('${item.name}')">&#x2715;</button>
    `;
    list.appendChild(row);
  });

  const shipping = 50;
  const total    = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 });
  if (totalEl)    totalEl.textContent    = '$' + total.toLocaleString('en-US',    { minimumFractionDigits: 2 });
}

// --- Checkout button (on cart.html) ---
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty. Add items first!');
    return;
  }
  showToast('Proceeding to checkout...');
  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 900);
}


/* ============================================================
   3. WALLET — Add Card form (wallet.html)
   ============================================================ */

// --- Auto-format card number as XXXX XXXX XXXX XXXX ---
function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

// --- Auto-format expiry as MM/YY ---
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}

// --- Numbers only for CVV field ---
function numbersOnly(input) {
  input.value = input.value.replace(/\D/g, '').substring(0, 4);
}

// --- Save card (validate then store) ---
function saveCard() {
  const name = document.getElementById('w-name')  ? document.getElementById('w-name').value.trim()   : '';
  const num  = document.getElementById('w-number') ? document.getElementById('w-number').value.trim() : '';
  const exp  = document.getElementById('w-expiry') ? document.getElementById('w-expiry').value.trim() : '';
  const cvv  = document.getElementById('w-cvv')    ? document.getElementById('w-cvv').value.trim()    : '';

  if (!name || !num || !exp || !cvv) {
    showToast('Please fill in all card details.');
    return;
  }
  if (num.replace(/\s/g, '').length < 16) {
    showToast('Please enter a valid 16-digit card number.');
    return;
  }
  if (exp.length < 5) {
    showToast('Please enter a valid expiry date (MM/YY).');
    return;
  }
  if (cvv.length < 3) {
    showToast('Please enter a valid CVV.');
    return;
  }

  showToast('Card saved successfully!');

  // Clear fields after save
  ['w-name', 'w-number', 'w-expiry', 'w-cvv'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}


/* ============================================================
   4. CONTACT FORM — validate and submit (contact.html)
   ============================================================ */
function submitContact() {
  const name  = document.getElementById('contact-name')  ? document.getElementById('contact-name').value.trim()  : '';
  const email = document.getElementById('contact-email') ? document.getElementById('contact-email').value.trim() : '';
  const msg   = document.getElementById('contact-msg')   ? document.getElementById('contact-msg').value.trim()   : '';

  if (!name || !email || !msg) {
    showToast('Please fill in all fields.');
    return;
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address.');
    return;
  }

  showToast("Message sent! We'll be in touch soon.");

  // Clear form fields
  ['contact-name', 'contact-email', 'contact-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}


/* ============================================================
   5. TOAST NOTIFICATION — small popup message (all pages)
   ============================================================ */
function showToast(msg) {
  // Create toast element if it doesn't exist in the HTML
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}


/* ============================================================
   6. INIT — runs automatically when any page loads
      Calls the right functions depending on which page we are on
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Always highlight the correct nav link
  setActiveNav();

  // Always update cart badge count in nav
  updateCartBadge();

  // If on cart.html — render cart items
  if (document.getElementById('cart-items-list')) {
    renderCart();
  }

});
