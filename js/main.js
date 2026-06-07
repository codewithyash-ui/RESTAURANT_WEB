// Enhanced main.js with scroll animations
const products = [
  { id: 'p1', name: 'Butter Naan', price: 45, currency: '₹', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg', description: 'Soft and fluffy butter naan', category: 'Bread' },
  { id: 'p2', name: 'Aloo Paratha', price: 60, currency: '₹', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', description: 'Stuffed whole wheat paratha', category: 'Paratha' },
  { id: 'p3', name: 'Samosa', price: 25, currency: '₹', image: 'https://images.pexels.com/photos/5896391/pexels-photo-5896391.jpeg', description: 'Crispy samosa', category: 'Snacks' },
  { id: 'p4', name: 'Gulab Jamun', price: 40, currency: '₹', image: 'https://images.pexels.com/photos/5707530/pexels-photo-5707530.jpeg', description: 'Soft gulab jamun', category: 'Sweet' },
  { id: 'p5', name: 'Jalebi', price: 30, currency: '₹', image: 'https://images.pexels.com/photos/5707634/pexels-photo-5707634.jpeg', description: 'Crispy jalebi', category: 'Sweet' },
  { id: 'p6', name: 'Pav Bhaji', price: 80, currency: '₹', image: 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg', description: 'Mumbai style pav bhaji', category: 'Snacks' }
];

function getCart() { return JSON.parse(localStorage.getItem('bakeryCart') || '[]'); }
function saveCart(cart) { localStorage.setItem('bakeryCart', JSON.stringify(cart)); }

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });
  saveCart(cart);
  showNotification(`${product.name} added to cart!`);
  updateCartCount();
  animateCart();
}

function animateCart() {
  const cartIcon = document.querySelector('a[href="cart.html"] i');
  if (cartIcon) {
    cartIcon.classList.add('cart-pulse');
    setTimeout(() => cartIcon.classList.remove('cart-pulse'), 500);
  }
}

function updateCartCount() {
  const count = getCart().reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => { if (el) el.textContent = count; });
}

function showNotification(msg) {
  const n = document.createElement('div');
  n.className = 'fixed bottom-24 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-right';
  n.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${msg}`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2500);
}

function loadProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;
  container.innerHTML = products.slice(0, 6).map((p, i) => `
    <div class="product-card scroll-reveal" style="animation-delay: ${i * 0.1}s">
      <img src="${p.image}" class="w-full h-56 object-cover">
      <div class="p-5">
        <div class="flex justify-between"><h3 class="text-xl font-bold">${p.name}</h3><span class="text-2xl font-bold" style="color: var(--primary)">${p.currency}${p.price}</span></div>
        <p class="text-gray-600 mt-2">${p.description}</p>
        <button data-product='${JSON.stringify(p)}' class="add-to-cart mt-4 w-full text-white py-3 rounded-full transition transform hover:scale-105 glow-on-hover" style="background-color: var(--primary)"><i class="fas fa-shopping-cart mr-2"></i> Add to Cart</button>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', () => addToCart(JSON.parse(btn.dataset.product))));
  updateCartCount();
}

// Scroll Reveal
function initScrollReveal() {
  const reveals = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

// Back to Top
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Mobile Menu
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-links');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('hidden'));
}

// Counters
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.counter').forEach(c => {
          const target = parseInt(c.dataset.target);
          let count = 0;
          const update = setInterval(() => { if (count < target) { count++; c.innerText = count; } else clearInterval(update); }, 30);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const stats = document.querySelector('.stats-section');
  if (stats) observer.observe(stats);
}

// Loading overlay hide
setTimeout(() => {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) { overlay.style.opacity = '0'; setTimeout(() => overlay.style.display = 'none', 800); }
}, 800);

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initScrollReveal();
  initBackToTop();
  initMobileMenu();
  initCounters();
  updateCartCount();
});