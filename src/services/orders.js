import api from "./api";

export const ordersAPI = {
  // Create new order
  createOrder: (orderData) => {
    return api.post("/orders", orderData);
  },

  // Get user's orders
  getUserOrders: () => {
    return api.get("/orders/me");
  },

  // Cancel order (user)
  cancelOrder: (orderId) => {
    return api.put(`/orders/${orderId}/cancel`);
  },

  // Admin: Get all orders
  getAllOrders: () => {
    return api.get("/orders");
  },

  // Admin: Update order status
  updateOrderStatus: (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status });
  },

  // Get order by ID (if needed)
  getOrder: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  // Bulk order creation (for cart checkout)
  createBulkOrder: (items) => {
    const promises = items.map((item) =>
      api.post("/orders", {
        productId: item.id,
        quantity: item.quantity,
      })
    );
    return Promise.all(promises);
  },
};
