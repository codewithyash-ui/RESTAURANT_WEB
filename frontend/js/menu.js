// frontend/js/menu.js - Fixed category filter (only one active at a time)
const API_BASE = '/api';

let allProducts = [];

async function loadFullMenu() {
  const container = document.getElementById('full-menu-container');
  if (!container) return;
  
  try {
    const res = await fetch(`${API_BASE}/products`);
    allProducts = await res.json();
    displayProducts(allProducts);
    updateCartCount();
  } catch (error) {
    container.innerHTML = `<div class="col-span-full text-center text-red-600 p-8">Error loading menu. Please try again later.</div>`;
    console.error(error);
  }
}

function displayProducts(products) {
  const container = document.getElementById('full-menu-container');
  
  if (products.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-500 p-8">No items in this category</div>';
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover">
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-xl font-bold text-gray-800">${product.name}</h3>
            <p class="text-sm" style="color: var(--primary)">${product.category}</p>
          </div>
          <span class="text-2xl font-bold" style="color: var(--primary)">${product.currency}${product.price}</span>
        </div>
        <p class="text-gray-600 mt-2 text-sm">${product.description}</p>
        <button data-product='${JSON.stringify(product)}' class="add-to-cart mt-4 w-full text-white px-4 py-2 rounded-full transition transform hover:scale-105 flex items-center justify-center gap-2" style="background-color: var(--primary)">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');
  
  // Attach add to cart handlers
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = JSON.parse(btn.dataset.product);
      addToCart(product);
      updateCartCount();
    });
  });
}

function filterMenu(category) {
  if (category === 'all') {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(product => product.category === category);
    displayProducts(filtered);
  }
}

function getCart() {
  const cart = localStorage.getItem('bakeryCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image,
      quantity: 1
    });
  }
  saveCart(cart);
  showNotification(`${product.name} added to cart! ${product.currency}${product.price}`);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElements = document.querySelectorAll('#cart-count');
  countElements.forEach(el => {
    if (el) el.textContent = count;
  });
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-right';
  notif.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }, 2000);
}

// Category filter event listeners - FIXED: Only one button active at a time
document.addEventListener('DOMContentLoaded', () => {
  loadFullMenu();
  
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // STEP 1: Remove active class/styles from ALL buttons
      filterBtns.forEach(button => {
        button.classList.remove('active', 'bg-orange-600', 'text-white');
        button.classList.add('bg-gray-200', 'text-gray-700');
        button.style.backgroundColor = '';
        button.style.color = '';
      });
      
      // STEP 2: Add active class/styles to ONLY the clicked button
      btn.classList.remove('bg-gray-200', 'text-gray-700');
      btn.classList.add('active', 'bg-orange-600', 'text-white');
      btn.style.backgroundColor = 'var(--primary)';
      btn.style.color = 'white';
      
      // STEP 3: Filter products based on category
      const category = btn.dataset.category;
      filterMenu(category);
    });
  });
});