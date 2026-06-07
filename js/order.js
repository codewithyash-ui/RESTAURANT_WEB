const products = [
  { id: 'p1', name: 'Butter Naan', price: 45, currency: '₹', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg' },
  { id: 'p2', name: 'Aloo Paratha', price: 60, currency: '₹', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg' },
  { id: 'p3', name: 'Samosa', price: 25, currency: '₹', image: 'https://images.pexels.com/photos/5896391/pexels-photo-5896391.jpeg' }
];

let orderItems = [];

function loadMenu() {
  const container = document.getElementById('order-menu-items');
  if (!container) return;
  container.innerHTML = products.map(p => `<div class="flex justify-between items-center p-3 border rounded"><span><b>${p.name}</b> ${p.currency}${p.price}</span><button data-product='${JSON.stringify(p)}' class="add-item bg-orange-600 text-white px-3 py-1 rounded">+ Add</button></div>`).join('');
  document.querySelectorAll('.add-item').forEach(btn => btn.addEventListener('click', () => { const p = JSON.parse(btn.dataset.product); const existing = orderItems.find(i => i.id === p.id); existing ? existing.quantity++ : orderItems.push({ ...p, quantity: 1 }); updateOrder(); }));
}

function updateOrder() {
  const container = document.getElementById('selected-items');
  const totalSpan = document.getElementById('order-total');
  if (!container) return;
  if (orderItems.length === 0) { container.innerHTML = '<p class="text-gray-500">No items selected</p>'; totalSpan.innerText = '0.00'; return; }
  let total = 0;
  container.innerHTML = orderItems.map((item, idx) => { total += item.price * item.quantity; return `<div class="flex justify-between py-2"><span>${item.name} x${item.quantity}</span><span>₹${(item.price * item.quantity).toFixed(2)} <button onclick="removeItem(${idx})" class="text-red-500"><i class="fas fa-trash"></i></button></span></div>`; }).join('');
  totalSpan.innerText = total.toFixed(2);
}
window.removeItem = (idx) => { orderItems.splice(idx, 1); updateOrder(); };

function placeOrder(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  if (!name || !phone || !address) { alert('Please fill details'); return; }
  if (orderItems.length === 0) { alert('Please add items'); return; }
  alert('🎉 Order Placed! (Demo Mode)');
  orderItems = [];
  updateOrder();
  document.getElementById('quick-order-form').reset();
}

document.addEventListener('DOMContentLoaded', () => { loadMenu(); document.getElementById('quick-order-form')?.addEventListener('submit', placeOrder); });