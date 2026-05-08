<!-- TOAST -->
<div id="toast"></div>


<script>
// ── CART STATE ──
let cart = [];
 
// ── NAVIGATION ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  window.scrollTo(0, 0);
}
 
// ── CART FUNCTIONS ──
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
  showToast(name + ' added to cart!');
}
 
function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  renderCart();
}
 
function renderCart() {
  const list = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
 
  list.innerHTML = '';
  let subtotal = 0;
 
  if (cart.length === 0) {
    emptyState.style.display = 'flex';
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    return;
  }
 
  emptyState.style.display = 'none';
 
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div style="background:linear-gradient(135deg,#c0cfd8,#8faab8);border-radius:3px;height:40px;"></div>
      <div>
        <h4>${item.name}</h4>
        <span class="qty">Qty: ${item.qty}</span>
      </div>
      <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('en-US', {minimumFractionDigits:2})}</div>
      <button class="remove-btn" onclick="removeFromCart('${item.name}')">&#x2715;</button>
    `;
    list.appendChild(row);
  });
 
  const total = subtotal + 50;
  subtotalEl.textContent = '$' + subtotal.toLocaleString('en-US', {minimumFractionDigits:2});
  document.querySelector('.shop-note').innerHTML = '';
  totalEl.textContent = '$' + total.toLocaleString('en-US', {minimumFractionDigits:2});
}
 
function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty. Add items first!');
    return;
  }
  showToast('Proceeding to checkout...');
  setTimeout(() => showPage('payment'), 900);
}
 
// ── WALLET FUNCTIONS ──
function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
 
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2);
  input.value = v;
}
 
function saveCard() {
  const name = document.getElementById('w-name').value.trim();
  const num = document.getElementById('w-number').value.trim();
  const exp = document.getElementById('w-expiry').value.trim();
  const cvv = document.getElementById('w-cvv').value.trim();
  if (!name || !num || !exp || !cvv) {
    showToast('Please fill in all card details.');
    return;
  }
  showToast('Card saved successfully!');
  document.getElementById('w-name').value = '';
  document.getElementById('w-number').value = '';
  document.getElementById('w-expiry').value = '';
  document.getElementById('w-cvv').value = '';
}
 
// ── CONTACT FORM ──
function submitContact() {
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const msg = document.getElementById('contact-msg').value.trim();
  if (!name || !email || !msg) {
    showToast('Please fill in all fields.');
    return;
  }
  showToast('Message sent! We\'ll be in touch soon.');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-msg').value = '';
}
 
// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}
 
// init cart render
renderCart();
</script>
</body>
</html>
