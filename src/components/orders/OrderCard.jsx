import {
  HiTruck,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiShoppingBag,
} from "react-icons/hi";
import { dateFormatters, formatCurrency } from "@/utils/formatters";
import { ORDER_STATUSES } from "@/utils/constants";
import Card from "@/components/ui/Card";
import OrderStatus from "./OrderStatus";
import { cn } from "@/utils/helpers";
import Button from "@/components/ui/Button";

const OrderCard = ({ order, isAdmin = false, onStatusChange, onCancel }) => {
  const totalAmount = order.quantity * order.product?.price || 0;

  const isUserCancelled = order.cancelledBy === "USER";
  const isAdminCancelled = order.cancelledBy === "ADMIN";
  const isCancelled = order.status === "CANCELLED";

  const showAdminDropdown = isAdmin && !isUserCancelled;

  const showUserCancel =
    !isAdmin && !isCancelled && ["PENDING", "CONFIRMED"].includes(order.status);

  console.log(
    `Order ${order.id} - cancelledBy: ${order.cancelledBy}, status: ${order.status}`
  );
  console.log(
    `showAdminDropdown: ${showAdminDropdown}, showUserCancel: ${showUserCancel}`
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <HiCheckCircle className="w-5 h-5 text-blue-500" />;
      case "SHIPPED":
        return <HiTruck className="w-5 h-5 text-purple-500" />;
      case "DELIVERED":
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case "CANCELLED":
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <HiClock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { id: "PENDING", label: "Order Placed" },
      { id: "CONFIRMED", label: "Confirmed" },
      { id: "SHIPPED", label: "Shipped" },
      { id: "DELIVERED", label: "Delivered" },
    ];
    const statusOrder = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
    const currentIndex = statusOrder.indexOf(status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && status !== "CANCELLED",
      current: index === currentIndex && status !== "CANCELLED",
    }));
  };

  const handleStatusChange = (newStatus) => {
    if (isUserCancelled && isAdmin) {
      console.warn("Cannot change status of user-cancelled order");
      return;
    }

    if (onStatusChange) {
      onStatusChange(order.id, newStatus);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-charcoal-700 rounded-lg overflow-hidden flex-shrink-0">
                {order.product?.imageUrl ? (
                  <img
                    src={order.product.imageUrl}
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiShoppingBag className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-one text-gray-900 dark:text-white mb-1">
                  {order.product?.name || "Product"}
                </h3>
                <p className="text-base font-three text-gray-600 dark:text-gray-400 mb-2">
                  Quantity: {order.quantity} ×{" "}
                  {formatCurrency(order.product?.price || 0)}
                </p>
                <p className="text-lg font-one text-primary-600">
                  Total: {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <OrderStatus status={order.status} />
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Order ID:
              </span>
              <p className="font-medium font-three text-gray-900 dark:text-white">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Order Date:
              </span>
              <p className="font-medium font-three text-gray-900 dark:text-white">
                {dateFormatters.toReadable(order.createdAt)}
              </p>
            </div>
            {isAdmin && order.user && (
              <>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Customer:
                  </span>
                  <p className="font-medium font-three text-gray-900 dark:text-white">
                    {order.user.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Email:
                  </span>
                  <p className="font-medium font-three text-gray-900 dark:text-white">
                    {order.user.email}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Cancellation Info - Show who cancelled */}
          {isCancelled && order.cancelledBy && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-charcoal-700">
              <p className="text-sm text-red-600 dark:text-red-400 font-three">
                Order cancelled by{" "}
                {order.cancelledBy === "USER" ? "customer" : "admin"}
              </p>
            </div>
          )}

          {/* Admin Dropdown*/}
          {showAdminDropdown && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-charcoal-700 font-three">
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Status:
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUserCancelled}
                className={cn(
                  "px-3 py-2 border rounded-lg bg-white dark:bg-charcoal-800 text-sm focus:ring-2 focus:ring-primary-500 border-gray-300 dark:border-charcoal-600 text-gray-900 dark:text-white",
                  isUserCancelled && "opacity-50 cursor-not-allowed"
                )}
              >
                {Object.values(ORDER_STATUSES).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {isUserCancelled && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Cannot modify orders cancelled by customer
                </p>
              )}
            </div>
          )}

          {/* User Cancel Button - Only show if user and order can be cancelled */}
          {showUserCancel && onCancel && (
            <div className="mt-4">
              <Button
                onClick={() => onCancel(order.id, "USER")}
                className="bg-red-600 hover:bg-red-700 text-white font-three"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </div>

        {/* Tracking Progress - Hide for cancelled orders */}
        {order.status !== "CANCELLED" && (
          <div className="lg:w-64">
            <h4 className="text-base font-one text-gray-900 dark:text-white mb-4">
              Order Progress
            </h4>
            <div className="space-y-4">
              {getTrackingSteps(order.status).map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center font-three space-x-3"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-base font-medium transition-colors",
                      step.completed
                        ? "bg-primary-600 text-white"
                        : step.current
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-2 border-primary-600"
                        : "bg-gray-100 dark:bg-charcoal-700 text-gray-400"
                    )}
                  >
                    {step.completed ? "✓" : index + 1}
                  </div>
                  <div
                    className={cn(
                      "flex-1 text-sm",
                      step.completed || step.current
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;
