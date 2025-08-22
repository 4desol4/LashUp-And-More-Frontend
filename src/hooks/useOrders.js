import { useState, useEffect } from "react";
import { ordersAPI } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export const useOrders = (isAdmin = false) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async (retryCount = 3, delay = 5000) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = isAdmin
        ? await ordersAPI.getAllOrders()
        : await ordersAPI.getUserOrders();

      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (retryCount > 0) {
        setTimeout(() => fetchOrders(retryCount - 1, delay), delay);
      } else {
        const message = err.response?.data?.message || "Failed to fetch orders";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.createOrder(orderData);
      setOrders((prev) => [response.data, ...prev]);
      toast.success("Order placed successfully!");
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to place order";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await ordersAPI.cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
      toast.success("Order cancelled successfully");
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to cancel order";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    try {
      setLoading(true);
      setError(null);

      await ordersAPI.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      toast.success("Order status updated successfully");
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update order status";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const bulkCreateOrders = async (cartItems) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.createBulkOrder(cartItems);

      if (Array.isArray(response)) {
        const newOrders = response.map((res) => res.data);
        setOrders((prev) => [...newOrders, ...prev]);
      }

      toast.success(`Successfully placed ${cartItems.length} order(s)!`);
      return { success: true, data: response };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to place orders";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated, isAdmin]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    bulkCreateOrders,
    cancelOrder,
    refetch: fetchOrders,
  };
};
