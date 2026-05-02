/* =========================
   PRODUCTS
========================= */
const PRODUCTS = [
  { id: 1, name: 'Lithium Ion Battery', price: 600 },
  { id: 2, name: 'Nickel Battery', price: 520 },
  { id: 3, name: 'Hybrid Battery Pack', price: 480 },
  { id: 4, name: 'Mild Hybrid Battery', price: 350 },
  { id: 5, name: 'Portable Charging Station', price: 220 },
  { id: 6, name: 'EV Cable Charger', price: 85 }
];

const SHIPPING = 50;


/* =========================
   CART
========================= */
const getCart = () => JSON.parse(sessionStorage.getItem('cart') || '[]');

const saveCart = (cart) => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
};

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (item) item.quantity++;
  else {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert('Added to cart');
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
}

function updateQuantity(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.quantity = +qty;
  saveCart(cart);
  renderCart();
}


/* =========================
   NAV + DROPDOWN
========================= */
function initNav() {
  const page = location.pathname.split('/').pop();

  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.style.color = 'red';
    }
  });

  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    dropdown.onmouseenter = () => dropdown.classList.add('active');
    dropdown.onmouseleave = () => dropdown.classList.remove('active');
  }
}


/* =========================
   SHOP
========================= */
function initShop() {
  document.querySelectorAll('.shop-btn').forEach((btn, i) => {
    btn.onclick = () => addToCart(PRODUCTS[i].id);
  });
}


/* =========================
   CART PAGE
========================= */
function renderCart() {
  const box = document.getElementById('cart-items');
  if (!box) return;

  const cart = getCart();
  box.innerHTML = '';

  if (cart.length === 0) {
    box.innerHTML = `<p>Your cart is empty</p>`;
    updateSummary(0);
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    box.innerHTML += `
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price} x ${item.quantity}</p>

        <select onchange="updateQuantity(${item.id}, this.value)">
          ${[1,2,3,4,5].map(n =>
            `<option ${n===item.quantity?'selected':''}>${n}</option>`
          )}
        </select>

        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });

  updateSummary(total);
}

function updateSummary(total) {
  const shipping = total ? SHIPPING : 0;
  const final = total + shipping;

  const ship = document.getElementById('cart-shipping');
  const sub = document.getElementById('cart-subtotal');

  if (ship) ship.textContent = '$' + shipping;
  if (sub) sub.textContent = '$' + final;
}


/* =========================
   PAYMENT
========================= */
function initPayment() {
  const btn = document.querySelector('.pay-submit');
  if (!btn) return;

  btn.onclick = (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll('input');
    for (let input of inputs) {
      if (!input.value.trim()) {
        alert('Fill all fields');
        return;
      }
    }

    saveCart([]);
    alert('Payment successful');
    location.href = 'home.html';
  };
}


/* =========================
   CONTACT
========================= */
function initContact() {
  const btn = document.querySelector('.cf-submit');
  if (!btn) return;

  btn.onclick = (e) => {
    e.preventDefault();

    const name = document.querySelector('[type="text"]');
    const email = document.querySelector('[type="email"]');
    const msg = document.querySelector('textarea');

    if (!name.value || !email.value || !msg.value) {
      alert('Fill all fields');
      return;
    }

    alert('Message sent');
    name.value = email.value = msg.value = '';
  };
}


/* =========================
   TESLA-STYLE EFFECTS
========================= */
function initEffects() {

  // Fade-in
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('show');
    });
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    };
  });

  // Button ripple
  document.querySelectorAll('button').forEach(btn => {
    btn.onclick = (e) => {
      const span = document.createElement('span');
      span.className = 'ripple';

      const rect = btn.getBoundingClientRect();
      span.style.left = e.clientX - rect.left + 'px';
      span.style.top = e.clientY - rect.top + 'px';

      btn.appendChild(span);
      setTimeout(() => span.remove(), 500);
    };
  });
}


/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initShop();
  renderCart();
  initPayment();
  initContact();
  initEffects();
});
