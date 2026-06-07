function loadOrders() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8">
    <div class="bg-yellow-100 p-4 rounded"><h3 class="font-bold">📢 Demo Mode</h3>
    <p>This is a frontend-only demo. To see real orders, deploy the backend on Render.</p>
    <p class="text-sm mt-2">Orders are shown here in demo mode.</p></div>
  </td></tr>`;
}
document.addEventListener('DOMContentLoaded', loadOrders);