import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiShoppingBag } from "react-icons/hi";
import { ordersAPI } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import OrderCard from "./OrderCard";
import LoadingSpinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/helpers";
import toast from "react-hot-toast";

const OrderList = ({ isAdmin = false }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { isAuthenticated } = useAuth();

  const statusFilters = [
    { id: "all", label: "All Orders" },
    { id: "PENDING", label: "Pending" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "SHIPPED", label: "Shipped" },
    { id: "DELIVERED", label: "Delivered" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = isAdmin
        ? await ordersAPI.getAllOrders()
        : await ordersAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === statusFilter)
      );
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);

      // Prevent admin from changing status of user-cancelled orders
      if (order.cancelledBy === "USER" && isAdmin) {
        toast.error("Cannot change status of an order cancelled by user");
        return;
      }

      // If admin is cancelling an order, set cancelledBy to ADMIN
      const updateData = {
        status: newStatus,
        ...(newStatus === "CANCELLED" && { cancelledBy: "ADMIN" }),
      };

      await ordersAPI.updateOrderStatus(orderId, newStatus);

      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: newStatus,
                ...(newStatus === "CANCELLED" && { cancelledBy: "ADMIN" }),
              }
            : o
        )
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleCancelOrder = (orderId, cancelledBy) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>
            {cancelledBy === "USER"
              ? "Are you sure you want to cancel this order?"
              : "Are you sure you want to cancel this order as Admin?"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  if (cancelledBy === "USER") {
                    await ordersAPI.cancelOrder(orderId);
                    toast.success("Order cancelled successfully");
                  } else if (cancelledBy === "ADMIN") {
                    await ordersAPI.updateOrderStatus(orderId, "CANCELLED");
                    toast.success("Order cancelled by admin");
                  }

                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === orderId
                        ? { ...o, status: "CANCELLED", cancelledBy }
                        : o
                    )
                  );
                } catch (error) {
                  console.error("Error cancelling order:", error);
                  toast.error("Failed to cancel order");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md"
            >
              Yes, Cancel
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 border rounded-md"
            >
              Keep Order
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-one text-gray-900 dark:text-white">
            {isAdmin ? "All Orders" : "My Orders"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-three">
            {isAdmin ? "Manage customer orders" : "Track your order history"}
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 font-three">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              statusFilter === filter.id
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-charcoal-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            )}
          >
            {filter.label}
            {filter.id !== "all" && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {orders.filter((order) => order.status === filter.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <HiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-one text-gray-900 dark:text-white mb-2">
            {statusFilter === "all"
              ? "No orders yet"
              : `No ${statusFilter.toLowerCase()} orders`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-three">
            {isAdmin
              ? "No orders match the selected filter."
              : "Start shopping to see your orders here."}
          </p>
          {!isAdmin && (
            <Button
              className="font-three"
              onClick={() => (window.location.href = "/shop")}
            >
              Start Shopping
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrderCard
                order={order}
                isAdmin={isAdmin}
                onStatusChange={isAdmin ? handleStatusChange : undefined}
                onCancel={handleCancelOrder}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
