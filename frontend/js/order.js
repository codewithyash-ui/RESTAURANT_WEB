// frontend/js/order.js - Quick order page (no validation)
const API_BASE = '/api';

let orderItems = [];

async function loadMenuItems() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();
    
    const container = document.getElementById('order-menu-items');
    container.innerHTML = products.map(product => `
      <div class="menu-item flex justify-between items-center p-3 border rounded-lg hover:bg-amber-50 transition">
        <div>
          <span class="font-semibold">${product.name}</span>
          <span class="text-amber-600 ml-2">$${product.price}</span>
        </div>
        <div class="flex items-center gap-2">
          <button data-id="${product.id}" data-price="${product.price}" data-name="${product.name}" data-img="${product.image}" class="add-item bg-amber-600 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-700">
            +
          </button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.add-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = {
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: parseFloat(btn.dataset.price),
          image: btn.dataset.img,
          quantity: 1
        };
        addToOrder(item);
      });
    });
  } catch (error) {
    console.error('Error loading menu:', error);
  }
}

function addToOrder(item) {
  const existing = orderItems.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    orderItems.push({ ...item });
  }
  updateOrderDisplay();
}

function removeFromOrder(index) {
  orderItems.splice(index, 1);
  updateOrderDisplay();
}

function updateQuantity(index, delta) {
  if (orderItems[index]) {
    orderItems[index].quantity += delta;
    if (orderItems[index].quantity < 1) {
      orderItems.splice(index, 1);
    }
    updateOrderDisplay();
  }
}

function updateOrderDisplay() {
  const container = document.getElementById('selected-items');
  const totalSpan = document.getElementById('order-total');
  
  if (!container) return;
  
  let total = 0;
  if (orderItems.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center">No items selected</p>';
    totalSpan.textContent = '0.00';
    return;
  }
  
  container.innerHTML = orderItems.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="flex justify-between items-center py-2 border-b">
        <div>
          <span class="font-medium">${item.name}</span>
          <span class="text-gray-600 text-sm ml-2">x${item.quantity}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-semibold">$${itemTotal.toFixed(2)}</span>
          <button onclick="updateQuantity(${idx}, -1)" class="qty-btn bg-gray-200 px-2 py-1 rounded">-</button>
          <button onclick="updateQuantity(${idx}, 1)" class="qty-btn bg-gray-200 px-2 py-1 rounded">+</button>
          <button onclick="removeFromOrder(${idx})" class="text-red-500 hover:text-red-700 ml-2">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  totalSpan.textContent = total.toFixed(2);
}

async function submitOrder(event) {
  event.preventDefault();
  
  if (orderItems.length === 0) {
    showMessage('Please add items to your order', 'error');
    return;
  }
  
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  
  if (!name || !phone || !address) {
    showMessage('Please fill in your details', 'error');
    return;
  }
  
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const orderData = {
    customer: { name, email: `${name}@customer.com`, address, phone },
    items: orderItems.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: total
  };
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      showMessage(`✅ Order Placed! Order ID: ${data.orderId}`, 'success');
      orderItems = [];
      updateOrderDisplay();
      document.getElementById('quick-order-form').reset();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } else {
      throw new Error(data.error || 'Order failed');
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function showMessage(message, type) {
  const msgDiv = document.getElementById('order-message');
  msgDiv.textContent = message;
  msgDiv.className = `mt-4 p-3 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
  msgDiv.classList.remove('hidden');
  
  setTimeout(() => {
    msgDiv.classList.add('hidden');
  }, 5000);
}

// Make functions global for onclick handlers
window.addToOrder = addToOrder;
window.removeFromOrder = removeFromOrder;
window.updateQuantity = updateQuantity;

document.addEventListener('DOMContentLoaded', () => {
  loadMenuItems();
  const container = document.getElementById('selected-items');
  if (!container) {
    const newDiv = document.createElement('div');
    newDiv.id = 'selected-items';
    document.querySelector('.bg-white.rounded-lg.shadow-lg.p-6:first-child .mt-6').before(newDiv);
  }
  document.getElementById('quick-order-form').addEventListener('submit', submitOrder);
  updateCartCount();
});

function getCart() { return JSON.parse(localStorage.getItem('bakeryCart') || '[]'); }
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const els = document.querySelectorAll('#cart-count');
  els.forEach(el => { if(el) el.textContent = count; });
}