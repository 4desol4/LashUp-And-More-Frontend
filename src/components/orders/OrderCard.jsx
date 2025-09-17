import {
  HiTruck,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiShoppingBag,
  HiCreditCard,
} from "react-icons/hi";
import { dateFormatters, formatCurrency } from "@/utils/formatters";
import Card from "@/components/ui/Card";
import OrderStatus from "./OrderStatus";
import { cn } from "@/utils/helpers";

const OrderCard = ({ order, isAdmin = false, onStatusChange }) => {
  const totalAmount =
    order.totalAmount || order.quantity * order.product?.price || 0;

  // Check payment status and prevent admin changes for unpaid orders
  const isPaid = order.paymentStatus === "SUCCESSFUL";
  const isCancelled = order.status === "CANCELLED";
  const isPending = order.status === "PENDING";

  // Admin can only change status of paid orders (CONFIRMED -> SHIPPED -> DELIVERED)
  const canChangeStatus = isAdmin && isPaid && !isCancelled;
  const allowedStatuses = ["CONFIRMED", "SHIPPED", "DELIVERED"];

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

  const getPaymentStatusBadge = () => {
    switch (order.paymentStatus) {
      case "SUCCESSFUL":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <HiCreditCard className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <HiClock className="w-3 h-3 mr-1" />
            Payment Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <HiXCircle className="w-3 h-3 mr-1" />
            Payment Failed
          </span>
        );
      default:
        return null;
    }
  };

  const getTrackingSteps = (status, paymentStatus) => {
    const steps = [
      { id: "PENDING", label: "Order Placed" },
      { id: "CONFIRMED", label: "Payment Confirmed" },
      { id: "SHIPPED", label: "Shipped" },
      { id: "DELIVERED", label: "Delivered" },
    ];

    if (status === "CANCELLED" || paymentStatus === "FAILED") {
      return steps.map((step, index) => ({
        ...step,
        completed: index === 0, // Only "Order Placed" is completed for cancelled
        current: false,
        cancelled: true,
      }));
    }

    const statusOrder = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && paymentStatus === "SUCCESSFUL",
      current: index === currentIndex && paymentStatus === "SUCCESSFUL",
    }));
  };

  const handleStatusChange = (newStatus) => {
    if (!canChangeStatus) {
      console.warn("Cannot change status of unpaid or cancelled orders");
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

            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <OrderStatus status={order.status} />
              </div>
              {getPaymentStatusBadge()}
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
            {order.paymentReference && (
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">
                  Payment Reference:
                </span>
                <p className="font-medium font-three text-gray-900 dark:text-white font-mono text-xs">
                  {order.paymentReference}
                </p>
              </div>
            )}
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

          {/* Payment Status Warning for Unpaid Orders */}
          {!isPaid && !isCancelled && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-three">
                <strong>Payment Required:</strong> This order is awaiting
                payment verification.
                {isPending &&
                  " Once payment is confirmed, the order will be processed."}
              </p>
            </div>
          )}

          {/* Shipping Information (if available and admin) */}
          {isAdmin && order.shippingInfo && (
            <div className="border-t border-gray-200 dark:border-charcoal-700 pt-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Shipping Information
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-three space-y-1">
                <p>
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                </p>
                <p>
                  {order.shippingInfo.email} • {order.shippingInfo.phone}
                </p>
                <p>{order.shippingInfo.address}</p>
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.state}
                </p>
              </div>
            </div>
          )}

          {/* Admin Status Update Dropdown - Only for paid orders */}
          {canChangeStatus && (
            <div className="border-t border-gray-200 dark:border-charcoal-700 pt-4 font-three">
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Order Status:
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-white dark:bg-charcoal-800 text-sm focus:ring-2 focus:ring-primary-500 border-gray-300 dark:border-charcoal-600 text-gray-900 dark:text-white"
              >
                {allowedStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Only paid orders can be updated
              </p>
            </div>
          )}

          {/* Unpaid Order Notice for Admin */}
          {isAdmin && !isPaid && !isCancelled && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-charcoal-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-three">
                <strong>Admin Note:</strong> This order cannot be updated until
                payment is verified.
              </p>
            </div>
          )}
        </div>

        {/* Tracking Progress - Show for all orders */}
        <div className="lg:w-64">
          <h4 className="text-base font-one text-gray-900 dark:text-white mb-4">
            Order Progress
          </h4>
          <div className="space-y-4">
            {getTrackingSteps(order.status, order.paymentStatus).map(
              (step, index) => (
                <div
                  key={step.id}
                  className="flex items-center font-three space-x-3"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-base font-medium transition-colors",
                      step.cancelled
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : step.completed
                        ? "bg-primary-600 text-white"
                        : step.current
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-2 border-primary-600"
                        : "bg-gray-100 dark:bg-charcoal-700 text-gray-400"
                    )}
                  >
                    {step.completed || step.cancelled ? "✓" : index + 1}
                  </div>
                  <div
                    className={cn(
                      "flex-1 text-sm",
                      step.cancelled
                        ? "text-red-600 dark:text-red-400"
                        : step.completed || step.current
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.label}
                    {step.cancelled && step.id === "PENDING" && (
                      <span className="block text-xs">
                        ({isCancelled ? "Cancelled" : "Payment Failed"})
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;
