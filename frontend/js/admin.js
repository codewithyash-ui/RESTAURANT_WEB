// frontend/js/admin.js
const API_BASE = '/api';

async function fetchOrders() {
  const tbody = document.getElementById('orders-table-body');
  const messageDiv = document.getElementById('admin-message');
  
  if (!tbody) return;
  
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const orders = await res.json();
    
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8">No orders found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = orders.map(order => `
      <tr class="border-b">
        <td class="px-4 py-3" data-label="Order ID">${order._id.slice(-8)}</td>
        <td class="px-4 py-3" data-label="Customer">${order.customer.name}<br><small>${order.customer.email}</small></td>
        <td class="px-4 py-3" data-label="Items">${order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
        <td class="px-4 py-3" data-label="Total">$${order.totalAmount.toFixed(2)}</td>
        <td class="px-4 py-3" data-label="Status"><span class="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">${order.status}</span></td>
        <td class="px-4 py-3" data-label="Date">${new Date(order.createdAt).toLocaleString()}</td>
      </tr>
    `).join('');
    
    // Add data-label for responsive mobile
    document.querySelectorAll('#orders-table-body td').forEach(td => {
      const label = td.parentElement.children[td.cellIndex]?.getAttribute('data-label');
      if (label) td.setAttribute('data-label', label);
    });
    
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-red-600 py-8">Error loading orders. Make sure backend server is running.</td></tr>';
    if (messageDiv) {
      messageDiv.innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded">Failed to connect to server. Is backend running?</div>';
    }
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', fetchOrders);