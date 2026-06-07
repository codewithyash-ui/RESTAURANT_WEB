// Products data (same as main.js)
const products = [
  { id: 'p1', name: 'Butter Naan', price: 45, currency: '₹', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg', description: 'Soft and fluffy butter naan', category: 'Bread' },
  { id: 'p2', name: 'Aloo Paratha', price: 60, currency: '₹', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', description: 'Stuffed whole wheat paratha', category: 'Paratha' },
  { id: 'p3', name: 'Pav Bhaji', price: 80, currency: '₹', image: 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg', description: 'Mumbai style pav bhaji', category: 'Snacks' },
  { id: 'p4', name: 'Samosa', price: 25, currency: '₹', image: 'https://images.pexels.com/photos/5896391/pexels-photo-5896391.jpeg', description: 'Crispy samosa', category: 'Snacks' },
  { id: 'p5', name: 'Gulab Jamun', price: 40, currency: '₹', image: 'https://images.pexels.com/photos/5707530/pexels-photo-5707530.jpeg', description: 'Soft gulab jamun', category: 'Sweet' },
  { id: 'p6', name: 'Jalebi', price: 30, currency: '₹', image: 'https://images.pexels.com/photos/5707634/pexels-photo-5707634.jpeg', description: 'Crispy jalebi', category: 'Sweet' },
  { id: 'p7', name: 'Puri Bhaji', price: 70, currency: '₹', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', description: 'Puri with bhaji', category: 'Breakfast' },
  { id: 'p8', name: 'Chole Bhature', price: 90, currency: '₹', image: 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg', description: 'Chole bhature', category: 'Special' },
  { id: 'p9', name: 'Kachori', price: 35, currency: '₹', image: 'https://images.pexels.com/photos/5896391/pexels-photo-5896391.jpeg', description: 'Crispy kachori', category: 'Snacks' },
  { id: 'p10', name: 'Masala Dosa', price: 85, currency: '₹', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', description: 'Crispy masala dosa', category: 'South Indian' },
  { id: 'p11', name: 'Idli Sambhar', price: 55, currency: '₹', image: 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg', description: 'Soft idli with sambhar', category: 'South Indian' },
  { id: 'p12', name: 'Rasgulla', price: 45, currency: '₹', image: 'https://images.pexels.com/photos/5707530/pexels-photo-5707530.jpeg', description: 'Soft rasgulla', category: 'Sweet' }
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
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => { if (el) el.textContent = count; });
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notif.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

function displayProducts(filteredProducts) {
  const container = document.getElementById('full-menu-container');
  if (!container) return;
  container.innerHTML = filteredProducts.map(product => `
    <div class="product-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <img src="${product.image}" class="w-full h-56 object-cover">
      <div class="p-5">
        <div class="flex justify-between"><h3 class="text-xl font-bold">${product.name}</h3><span class="text-2xl font-bold" style="color: var(--primary)">${product.currency}${product.price}</span></div>
        <p class="text-gray-600 mt-2">${product.description}</p>
        <button data-product='${JSON.stringify(product)}' class="add-to-cart mt-4 w-full text-white py-2 rounded-full" style="background-color: var(--primary)">Add to Cart</button>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', () => addToCart(JSON.parse(btn.dataset.product))));
}

let allProducts = products;
document.addEventListener('DOMContentLoaded', () => {
  displayProducts(allProducts);
  updateCartCount();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('bg-orange-600', 'text-white'); b.classList.add('bg-gray-200', 'text-gray-700'); });
      btn.classList.remove('bg-gray-200', 'text-gray-700'); btn.classList.add('bg-orange-600', 'text-white');
      const filtered = btn.dataset.category === 'all' ? allProducts : allProducts.filter(p => p.category === btn.dataset.category);
      displayProducts(filtered);
    });
  });
});