/* ============================================================
   PowerUp Batteries — Full Website JavaScript (Simplified)
   Add to every page: <script src="main.js" defer></script>
   ============================================================ */


/* ── PRODUCT DATA ── */
const PRODUCTS = [
  { id: 1, name: 'Lithium Ion Battery',                       price: 600 },
  { id: 2, name: 'Nickel Battery',                            price: 520 },
  { id: 3, name: 'Hybrid Battery Pack',                       price: 480 },
  { id: 4, name: 'Mild Hybrid Battery',                       price: 350 },
  { id: 5, name: 'Portable Charging Station',                 price: 220 },
  { id: 6, name: 'Portable Electronic Vehicle Cable Charger', price: 85  },
];

const SHIPPING = 50;


/* ============================================================
   CART HELPERS
   ============================================================ */

function getCart() {
  return JSON.parse(sessionStorage.getItem('pu_cart') || '[]');
}

function saveCart(cart) {
  sessionStorage.setItem('pu_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert('✅ ' + product.name + ' has been added to your cart!');
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart(); // refresh cart display
}

function updateQuantity(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) item.quantity = parseInt(newQty);
  saveCart(cart);
  renderCart(); // refresh totals
}


/* ============================================================
   NAV — highlight active page link
   ============================================================ */

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.style.color = '#c0392b';
    }
  });
}


/* ============================================================
   HOME PAGE — hero & nav buttons
   ============================================================ */

function initHomePage() {
  // "Learn More" / CTA buttons on home page
  document.querySelectorAll('.cta-btn, .learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('🔋 Welcome to PowerUp Batteries!\nExplore our range of EV battery solutions.');
    });
  });

  // "What We Offer" service cards
  document.querySelectorAll('.offer-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const label = card.querySelector('strong, .offer-card-label strong');
      const service = label ? label.textContent : 'this service';
      alert('🔧 ' + service + '\nContact us at powerupbatteriesbw@gmail.com to book this service.');
    });
  });
}


/* ============================================================
   SHOP PAGE — "Shop Now" buttons
   ============================================================ */

function initShopPage() {
  // Wire each .shop-btn by its position to the matching product
  const buttons = document.querySelectorAll('.product-card .shop-btn');
  buttons.forEach((btn, index) => {
    const product = PRODUCTS[index];
    if (!product) return;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product.id);
    });
  });

  // "Shop All" button — scrolls to product list
  document.querySelectorAll('.shop-all-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = document.querySelector('.products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('🛒 Browse all our products above!');
      }
    });
  });

  // Category cards — filter prompt
  document.querySelectorAll('.category-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.querySelector('h4');
      const category = title ? title.textContent : 'this category';
      alert('📦 ' + category + '\nScroll up to browse all ' + category + ' products!');
    });
  });
}


/* ============================================================
   CART PAGE — render items, quantities, totals
   ============================================================ */

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `
      <p style="color:#888; font-size:1rem; padding:20px 0;">
        Your cart is empty. 
        <a href="shop.html" style="color:#c0392b; font-weight:700;">Shop now →</a>
      </p>`;
    updateOrderSummary(0);
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:20px; margin-bottom:24px; padding-bottom:24px; border-bottom:1px solid #eee;';

    row.innerHTML = `
      <div style="width:180px; height:110px; background:#ccc; border-radius:4px;
           display:flex; align-items:center; justify-content:center;
           font-size:0.7rem; color:#555; text-align:center; flex-shrink:0; padding:8px;">
        <!-- ADD IMAGE: <img src="${item.name.toLowerCase().replace(/ /g,'-')}.jpg"> -->
        [ ${item.name} Image ]
      </div>
      <div style="flex:1;">
        <p style="font-weight:600; margin-bottom:10px;">${item.name}</p>
        <div style="display:flex; align-items:center; gap:12px; font-size:0.85rem; margin-bottom:8px;">
          <span>Quantity:</span>
          <select onchange="updateQuantity(${item.id}, this.value)"
            style="border:1px solid #ccc; border-radius:4px; padding:2px 8px; font-size:0.85rem; cursor:pointer;">
            ${[1,2,3,4,5,6,7,8,9,10].map(n =>
              `<option value="${n}" ${n === item.quantity ? 'selected' : ''}>${n}</option>`
            ).join('')}
          </select>
          <span onclick="removeFromCart(${item.id})"
            style="color:#c0392b; cursor:pointer; text-decoration:underline; font-size:0.85rem;">
            Remove
          </span>
        </div>
        <p style="font-weight:700; font-size:1rem;">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>`;

    container.appendChild(row);
  });

  const itemsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  updateOrderSummary(itemsTotal);
}

function updateOrderSummary(itemsTotal) {
  const shipping    = itemsTotal > 0 ? SHIPPING : 0;
  const subtotal    = itemsTotal + shipping;

  const shippingEl  = document.getElementById('cart-shipping');
  const subtotalEl  = document.getElementById('cart-subtotal');

  if (shippingEl) shippingEl.textContent  = '$' + shipping.toFixed(2);
  if (subtotalEl) subtotalEl.textContent  = '$ ' + subtotal.toFixed(2);
}

function initCartPage() {
  renderCart();

  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('🛒 Your cart is empty! Add some products before checking out.');
      } else {
        const confirmed = confirm('✅ Proceed to payment?\n\nYou will be redirected to the payment page.');
        if (confirmed) window.location.href = 'payment.html';
      }
    });
  }
}


/* ============================================================
   PAYMENT PAGE — card form & payment methods
   ============================================================ */

function initPaymentPage() {
  // Submit button
  const submitBtn = document.querySelector('.pay-submit, [type="submit"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const cardName   = document.querySelector('input[placeholder="CARD NAME"]');
      const cardNumber = document.querySelector('input[placeholder="CARD NUMBER"]');
      const expiry     = document.querySelector('input[placeholder="MM/YY"]');
      const cvv        = document.querySelector('input[placeholder="CVV"]');

      // Basic validation
      if (cardName && !cardName.value.trim()) {
        alert('⚠️ Please enter the card name.'); cardName.focus(); return;
      }
      if (cardNumber && cardNumber.value.replace(/\s/g,'').length < 12) {
        alert('⚠️ Please enter a valid card number.'); cardNumber.focus(); return;
      }
      if (expiry && !expiry.value.trim()) {
        alert('⚠️ Please enter the expiry date (MM/YY).'); expiry.focus(); return;
      }
      if (cvv && cvv.value.length < 3) {
        alert('⚠️ Please enter a valid CVV.'); cvv.focus(); return;
      }

      // Clear cart and confirm
      saveCart([]);
      alert('🎉 Payment Successful!\nThank you for your purchase. Your order is confirmed!');
      window.location.href = 'home.html';
    });
  }

  // Payment method cards (PayPal, Visa, etc.)
  document.querySelectorAll('.pm-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const method = card.textContent.trim() || 'this method';
      alert('💳 You selected: ' + method + '\nFill in your card details above to complete payment.');
    });
  });
}


/* ============================================================
   CONTACT PAGE — contact form
   ============================================================ */

function initContactPage() {
  const submitBtn = document.querySelector('.cf-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name    = document.querySelector('.cf-input[type="text"]');
      const email   = document.querySelector('.cf-input[type="email"]');
      const message = document.querySelector('.cf-textarea');

      if (name && !name.value.trim()) {
        alert('⚠️ Please enter your name.'); name.focus(); return;
      }
      if (email && !email.value.includes('@')) {
        alert('⚠️ Please enter a valid email address.'); email.focus(); return;
      }
      if (message && !message.value.trim()) {
        alert('⚠️ Please leave a message before submitting.'); message.focus(); return;
      }

      alert('✅ Message sent!\nThank you, ' + (name ? name.value : '') + '. A PowerUp Batteries representative will contact you shortly.');

      // Clear form
      if (name)    name.value    = '';
      if (email)   email.value   = '';
      if (message) message.value = '';
    });
  }
}


/* ============================================================
   AUTO-INIT — runs on every page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav();
  initHomePage();
  initShopPage();
  initCartPage();
  initPaymentPage();
  initContactPage();
});

