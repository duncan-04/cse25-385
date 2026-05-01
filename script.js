<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cart</title>

<style>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #fafafa;
  }

  /* CENTERING WRAPPER */
  #cart-wrapper {
    display: flex;
    justify-content: center;
    padding: 50px 20px;
  }

  #cart-items {
    width: 100%;
    max-width: 800px;
  }

  /* ORDER SUMMARY */
  .order-summary {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border-top: 2px solid #eee;
  }

  .checkout-btn {
    width: 100%;
    padding: 14px;
    background: #c0392b;
    color: #fff;
    border: none;
    font-weight: bold;
    cursor: pointer;
    margin-top: 15px;
  }

  .checkout-btn:hover {
    background: #a93226;
  }
</style>
</head>

<body>

<div id="cart-wrapper">
  <div id="cart-items"></div>
</div>

<div class="order-summary">
  <p>Shipping: <span id="cart-shipping">$0.00</span></p>
  <p><strong>Total: <span id="cart-subtotal">$0.00</span></strong></p>
  <button class="checkout-btn">Checkout</button>
</div>

<script>
const SHIPPING = 10;

// Example cart storage (replace with your real one)
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQuantity(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.quantity = parseInt(qty);
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

/* =========================
   RENDER CART
========================= */
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 0;">
        <p style="color:#888; font-size:1rem;">
          Your cart is empty.
          <a href="shop.html" style="color:#c0392b; font-weight:700;">Shop now →</a>
        </p>
      </div>`;
    updateOrderSummary(0);
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = `
      display:flex;
      align-items:center;
      gap:20px;
      margin-bottom:24px;
      padding-bottom:24px;
      border-bottom:1px solid #eee;
    `;

    row.innerHTML = `
      <div style="width:180px; height:110px; background:#ccc; border-radius:4px;
           display:flex; align-items:center; justify-content:center;
           font-size:0.7rem; color:#555; text-align:center; flex-shrink:0;">
        [ ${item.name} Image ]
      </div>

      <div style="flex:1;">
        <p style="font-weight:600; margin-bottom:10px;">${item.name}</p>

        <div style="display:flex; align-items:center; gap:12px; font-size:0.85rem; margin-bottom:8px;">
          <span>Quantity:</span>

          <select onchange="updateQuantity(${item.id}, this.value)"
            style="border:1px solid #ccc; border-radius:4px; padding:2px 8px; cursor:pointer;">
            ${[1,2,3,4,5,6,7,8,9,10].map(n =>
              `<option value="${n}" ${n === item.quantity ? 'selected' : ''}>${n}</option>`
            ).join('')}
          </select>

          <span onclick="removeFromCart(${item.id})"
            style="color:#c0392b; cursor:pointer; text-decoration:underline;">
            Remove
          </span>
        </div>

        <p style="font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `;

    container.appendChild(row);
  });

  const itemsTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  updateOrderSummary(itemsTotal);
}

/* =========================
   ORDER SUMMARY
========================= */
function updateOrderSummary(itemsTotal) {
  const shipping = itemsTotal > 0 ? SHIPPING : 0;
  const subtotal = itemsTotal + shipping;

  document.getElementById('cart-shipping').textContent = '$' + shipping.toFixed(2);
  document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
}

/* =========================
   INIT
========================= */
function initCartPage() {
  renderCart();

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();

      if (cart.length === 0) {
        alert('🛒 Your cart is empty!');
      } else {
        const confirmed = confirm('Proceed to payment?');
        if (confirmed) window.location.href = 'payment.html';
      }
    });
  }
}

initCartPage();
</script>

</body>
</html>
