function getCart() { return JSON.parse(localStorage.getItem('bakeryCart') || '[]'); }
function saveCart(cart) { localStorage.setItem('bakeryCart', JSON.stringify(cart)); }

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const totalSpan = document.getElementById('cart-total');
  if (!container) return;
  if (cart.length === 0) { container.innerHTML = '<div class="text-center py-8">Your cart is empty. <a href="menu.html" class="text-orange-600 underline">Browse Menu</a></div>'; totalSpan.innerText = '0.00'; return; }
  let total = 0;
  container.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `<div class="flex flex-wrap justify-between items-center border-b pb-4 mb-4">
      <div class="flex gap-4"><img src="${item.image}" class="w-20 h-20 object-cover rounded"><div><h3 class="font-semibold">${item.name}</h3><p class="text-orange-600">₹${item.price} each</p></div></div>
      <div class="flex gap-2"><button class="qty-decr bg-gray-200 px-3 py-1 rounded" data-index="${idx}">-</button><input type="number" class="quantity w-16 text-center border rounded" value="${item.quantity}" min="1" data-index="${idx}"><button class="qty-incr bg-gray-200 px-3 py-1 rounded" data-index="${idx}">+</button><button class="remove-item bg-red-500 text-white px-3 py-1 rounded" data-index="${idx}">Remove</button></div>
      <div class="font-semibold">₹${itemTotal.toFixed(2)}</div>
    </div>`;
  }).join('');
  totalSpan.innerText = total.toFixed(2);
  attachEvents();
}

function attachEvents() {
  document.querySelectorAll('.qty-decr').forEach(btn => btn.addEventListener('click', () => { let idx = parseInt(btn.dataset.index); let cart = getCart(); if (cart[idx]) { cart[idx].quantity--; if (cart[idx].quantity < 1) cart.splice(idx, 1); saveCart(cart); renderCart(); updateCartCount(); } }));
  document.querySelectorAll('.qty-incr').forEach(btn => btn.addEventListener('click', () => { let idx = parseInt(btn.dataset.index); let cart = getCart(); if (cart[idx]) { cart[idx].quantity++; saveCart(cart); renderCart(); updateCartCount(); } }));
  document.querySelectorAll('.quantity').forEach(input => input.addEventListener('change', (e) => { let idx = parseInt(input.dataset.index); let cart = getCart(); let newQty = parseInt(input.value); if (cart[idx] && newQty > 0) { cart[idx].quantity = newQty; saveCart(cart); renderCart(); updateCartCount(); } }));
  document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', () => { let idx = parseInt(btn.dataset.index); let cart = getCart(); cart.splice(idx, 1); saveCart(cart); renderCart(); updateCartCount(); }));
}

function updateCartCount() { const count = getCart().reduce((s,i) => s + i.quantity, 0); document.querySelectorAll('#cart-count').forEach(el => { if(el) el.textContent = count; }); }

document.addEventListener('DOMContentLoaded', () => { renderCart(); updateCartCount(); document.getElementById('checkout-btn')?.addEventListener('click', () => { if(getCart().length === 0) alert('Cart is empty!'); else window.location.href = 'checkout.html'; }); });