// frontend/js/main.js - Enhanced with Counters, Back to Top, Loading Overlay
const API_BASE = '/api';

function getCart() {
  const cart = localStorage.getItem('bakeryCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
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
  updateCartCount();
  animateCart(); // Add cart animation
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
  notif.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-500';
  notif.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }, 2000);
}

// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;
  
  counters.forEach(counter => {
    const updateCount = () => {
      const target = parseInt(counter.getAttribute('data-target'));
      const count = parseInt(counter.innerText);
      const increment = target / speed;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    
    updateCount();
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Loading Overlay
function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    }, 500);
  }
}

// Cart Animation
function animateCart() {
  const cartIcon = document.querySelector('a[href="/cart.html"] i');
  if (cartIcon) {
    cartIcon.classList.add('cart-pulse');
    setTimeout(() => {
      cartIcon.classList.remove('cart-pulse');
    }, 500);
  }
}

async function loadProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();
    
    // Show first 6 products on homepage
    const featuredProducts = products.slice(0, 6);
    
    container.innerHTML = featuredProducts.map((product, index) => `
      <div class="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 img-zoom" style="animation-delay: ${index * 0.1}s">
        <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover transition-transform duration-500 hover:scale-110">
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-semibold text-gray-800">${product.name}</h3>
            <span class="text-2xl font-bold" style="color: var(--primary)">${product.currency}${product.price}</span>
          </div>
          <p class="text-gray-600 mt-2 text-sm">${product.description}</p>
          <button data-product='${JSON.stringify(product)}' class="add-to-cart mt-4 w-full text-white px-4 py-2 rounded-full transition transform hover:scale-105 glow-on-hover" style="background-color: var(--primary)">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productData = JSON.parse(btn.dataset.product);
        addToCart(productData);
      });
    });
    
    updateCartCount();
  } catch (error) {
    container.innerHTML = `<div class="col-span-full text-center text-red-600 p-8">Error loading products. Please try again later.</div>`;
    console.error(error);
  }
}

// Scroll animation observer
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => observer.observe(el));
}

// Mobile menu toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('hidden');
    });
  }
}

// Initialize Stats Counter when stats section is visible
function initStatsObserver() {
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }
}

// Page transition effect
function initPageTransition() {
  document.body.classList.add('page-transition');
}

// Initialize all features
function initEnhancedFeatures() {
  hideLoadingOverlay();
  initBackToTop();
  initStatsObserver();
  initPageTransition();
}

// Initialize
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initScrollAnimations();
    initMobileMenu();
    updateCartCount();
    initEnhancedFeatures();
  });
}