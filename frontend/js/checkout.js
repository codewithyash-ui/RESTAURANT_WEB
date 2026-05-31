// frontend/js/checkout.js - NO payment validation
const API_BASE = '/api';

function getCart() {
  const cart = localStorage.getItem('bakeryCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem('bakeryCart');
}

function displayOrderSummary() {
  const cart = getCart();
  const container = document.getElementById('checkout-items');
  const totalSpan = document.getElementById('checkout-total');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<div class="text-center py-8 text-gray-500">Your cart is empty. <a href="/" class="text-amber-600 underline">Continue shopping</a></div>';
    if (totalSpan) totalSpan.innerText = '0.00';
    return;
  }
  
  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="flex justify-between py-2 border-b">
        <span>${item.name} x ${item.quantity}</span>
        <span class="font-semibold">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  }).join('');
  
  if (totalSpan) totalSpan.innerText = total.toFixed(2);
  return total;
}

// NO VALIDATION - Just check if fields are filled
function validateForm() {
  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  
  // Only check if required customer fields are filled
  if (!name || !email || !phone || !address) {
    return { valid: false, message: 'Please fill all customer information fields.' };
  }
  
  // Basic email format check (optional - can remove if you want)
  if (!email.includes('@')) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  
  // NO payment validation at all! Card, expiry, CVV can be anything
  return { valid: true };
}

async function submitOrder(event) {
  event.preventDefault();
  const validation = validateForm();
  const messageDiv = document.getElementById('form-message');
  
  if (!validation.valid) {
    messageDiv.textContent = validation.message;
    messageDiv.className = 'mb-4 p-3 rounded bg-red-100 text-red-700';
    messageDiv.classList.remove('hidden');
    return;
  }
  
  const cart = getCart();
  if (cart.length === 0) {
    messageDiv.textContent = 'Your cart is empty. Cannot place order.';
    messageDiv.className = 'mb-4 p-3 rounded bg-red-100 text-red-700';
    messageDiv.classList.remove('hidden');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderData = {
    customer: {
      name: document.getElementById('fullname').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      phone: document.getElementById('phone').value.trim()
    },
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: total
  };
  
  const submitBtn = document.getElementById('submit-order');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Order failed');
    }
    
    const data = await res.json();
    clearCart();
    
    messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ✅ Order Placed Successfully! Order ID: ${data.orderId}`;
    messageDiv.className = 'mb-4 p-3 rounded bg-green-100 text-green-700';
    messageDiv.classList.remove('hidden');
    
    // Clear form
    document.getElementById('checkout-form').reset();
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Order Placed!';
    
    // Update cart count on other pages
    updateCartCount();
    
    // Redirect after 3 seconds
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    
  } catch (err) {
    messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error: ${err.message}`;
    messageDiv.className = 'mb-4 p-3 rounded bg-red-100 text-red-700';
    messageDiv.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElements = document.querySelectorAll('#cart-count');
  countElements.forEach(el => {
    if (el) el.textContent = count;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayOrderSummary();
  updateCartCount();
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', submitOrder);
  }
});