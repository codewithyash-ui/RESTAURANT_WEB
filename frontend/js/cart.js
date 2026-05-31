// frontend/js/cart.js - Updated with theme support
function getCart() {
  const cart = localStorage.getItem('bakeryCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('bakeryCart', JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const totalSpan = document.getElementById('cart-total');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<div class="text-center py-8 text-gray-500">Your cart is empty. <a href="/menu.html" class="underline" style="color: var(--primary)">Browse Menu</a></div>';
    if (totalSpan) totalSpan.innerText = '0.00';
    return;
  }
  
  let total = 0;
  container.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="flex flex-wrap items-center justify-between border-b pb-4 mb-4">
        <div class="flex items-center gap-4 w-full md:w-auto">
          <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
          <div>
            <h3 class="font-semibold">${item.name}</h3>
            <p class="text-sm" style="color: var(--primary)">${item.hindiName || ''}</p>
            <p class="font-medium" style="color: var(--primary)">₹${item.price.toFixed(2)} each</p>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-3 md:mt-0">
          <button class="qty-decr bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition" data-index="${idx}">-</button>
          <input type="number" class="quantity-input w-16 text-center border rounded" value="${item.quantity}" min="1" data-index="${idx}">
          <button class="qty-incr bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition" data-index="${idx}">+</button>
          <button class="remove-item bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600 transition" data-index="${idx}">Remove</button>
        </div>
        <div class="w-full md:w-auto text-right mt-2 md:mt-0 font-semibold" style="color: var(--primary)">₹${itemTotal.toFixed(2)}</div>
      </div>
    `;
  }).join('');
  
  if (totalSpan) totalSpan.innerText = total.toFixed(2);
  
  // Attach event listeners
  document.querySelectorAll('.qty-decr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      updateQuantity(idx, -1);
    });
  });
  
  document.querySelectorAll('.qty-incr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      updateQuantity(idx, 1);
    });
  });
  
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = parseInt(input.dataset.index);
      let newQty = parseInt(input.value);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      updateQuantityDirect(idx, newQty);
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      removeItem(idx);
    });
  });
}

function updateQuantity(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    saveCart(cart);
    renderCart();
    updateCartCount();
  }
}

function updateQuantityDirect(index, newQty) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = newQty;
    saveCart(cart);
    renderCart();
    updateCartCount();
  }
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
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
  renderCart();
  updateCartCount();
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      window.location.href = '/checkout.html';
    });
  }
});