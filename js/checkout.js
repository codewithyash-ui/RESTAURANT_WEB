function getCart() { return JSON.parse(localStorage.getItem('bakeryCart') || '[]'); }

function displayOrderSummary() {
  const cart = getCart();
  const container = document.getElementById('checkout-items');
  const totalSpan = document.getElementById('checkout-total');
  if (!container) return;
  if (cart.length === 0) { container.innerHTML = '<p>Your cart is empty. <a href="menu.html">Shop now</a></p>'; totalSpan.innerText = '0.00'; return; }
  let total = 0;
  container.innerHTML = cart.map(item => { total += item.price * item.quantity; return `<div class="flex justify-between py-2"><span>${item.name} x ${item.quantity}</span><span>₹${(item.price * item.quantity).toFixed(2)}</span></div>`; }).join('');
  totalSpan.innerText = total.toFixed(2);
}

function placeOrder(e) {
  e.preventDefault();
  const name = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  if (!name || !email || !phone || !address) { showMessage('Please fill all fields', 'error'); return; }
  showMessage('🎉 Order Placed Successfully! (Demo Mode)', 'success');
  localStorage.removeItem('bakeryCart');
  document.getElementById('checkout-form').reset();
  updateCartCount();
  setTimeout(() => window.location.href = 'index.html', 3000);
}

function showMessage(msg, type) {
  const div = document.getElementById('form-message');
  div.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
  div.className = `mb-4 p-3 rounded ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
  div.classList.remove('hidden');
  setTimeout(() => div.classList.add('hidden'), 3000);
}

function updateCartCount() { const count = getCart().reduce((s,i) => s + i.quantity, 0); document.querySelectorAll('#cart-count').forEach(el => { if(el) el.textContent = count; }); }

document.addEventListener('DOMContentLoaded', () => { displayOrderSummary(); updateCartCount(); document.getElementById('checkout-form')?.addEventListener('submit', placeOrder); });