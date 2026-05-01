/* ============================================================
   PowerUp Batteries — Shop & Cart JS (Simplified)
   Add to both pages: <script src="shop_cart_simple.js" defer></script>
   ============================================================ */

/* --- Product Data --- */
const PRODUCTS = [
  { id: 1, name: 'Lithium Ion Battery',                       price: 600 },
  { id: 2, name: 'Nickel Battery',                            price: 520 },
  { id: 3, name: 'Hybrid Battery Pack',                       price: 480 },
  { id: 4, name: 'Mild Hybrid Battery',                       price: 350 },
  { id: 5, name: 'Portable Charging Station',                 price: 220 },
  { id: 6, name: 'Portable Electronic Vehicle Cable Charger', price: 85  },
];

const SHIPPING = 50;

/* --- Cart Helpers (saved in sessionStorage) --- */

function getCart() {
  return JSON.parse(sessionStorage.getItem('pu_cart') || '[]');
}

function saveCart(cart) {
  sessionStorage.setItem('pu_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert(product.name + ' added to cart!');
}

function removeItem(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
  renderCart();
}

function updateQuantity(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) item.quantity = parseInt(newQty);
  saveCart(cart);
  renderCart();
}

/* ============================================================
   SHOP PAGE — wire up "Shop Now" buttons by position
   ============================================================ */

function initShop() {
  const buttons = document.querySelectorAll('.shop-btn');
  buttons.forEach((btn, index) => {
    const product = PRODUCTS[index];
    if (!product) return;
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => addToCart(product.id));
  });
}

/* ============================================================
   CART PAGE — render items and totals
   ============================================================ */

function renderCart() {
  const container = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    if (subtotalEl) subtotalEl.textContent = '$ ' + SHIPPING.toFixed(2);
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;gap:16px;margin-bottom:20px;';
    div.innerHTML = `
      <div style="width:180px;height:110px;background:#ccc;border-radius:4px;
           display:flex;align-items:center;justify-content:center;font-size:0.75rem;">
        ${item.name}
      </div>
      <div>
        <p><strong>${item.name}</strong></p>
        <p style="margin:8px 0;">
          Quantity:
          <select onchange="updateQuantity(${item.id}, this.value)"
            style="border:1px solid #ccc;padding:2px 6px;border-radius:4px;">
            ${[1,2,3,4,5].map(n =>
              `<option ${n === item.quantity ? 'selected' : ''}>${n}</option>`
            ).join('')}
          </select>
          <span onclick="removeItem(${item.id})"
            style="margin-left:12px;color:#c0392b;cursor:pointer;text-decoration:underline;">
            Remove
          </span>
        </p>
        <p><strong>$${(item.price * item.quantity).toFixed(2)}</strong></p>
      </div>`;
    container.appendChild(div);
  });

  /* Update subtotal */
  const itemsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const subtotal = itemsTotal + SHIPPING;
  if (subtotalEl) subtotalEl.textContent = '$ ' + subtotal.toFixed(2);
}

function initCheckout() {
  const btn = document.querySelector('.checkout-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (getCart().length === 0) {
      alert('Your cart is empty!');
    } else {
      window.location.href = 'payment.html';
    }
  });
}

/* --- Auto-detect page and initialise --- */
document.addEventListener('DOMContentLoaded', () => {
  initShop();
  renderCart();
  initCheckout();
});

