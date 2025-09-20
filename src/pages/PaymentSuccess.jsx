import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { paymentAPI } from "@/services/payment";
import {
  HiCheckCircle,
  HiXCircle,
  HiHome,
  HiShoppingBag,
} from "react-icons/hi";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/formatters";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      toast.error("Invalid payment reference");
      navigate("/shop");
      return;
    }
    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.verifyPayment(reference);
      console.log("Verify response:", response.data);

      const { orders, paymentData } = response.data;

      setPaymentStatus("success");

      const firstOrder = orders?.[0] || {};

      setOrderData({
        orderId: firstOrder.id || "N/A",
        reference: paymentData.reference || reference,
        amount: (paymentData.amount || 0) / 100,
        status: firstOrder.status || paymentData.status || "N/A",
        items: orders || [],
      });

      localStorage.removeItem("pendingOrder");
      toast.success("Payment successful! Your order has been confirmed.");
    } catch (error) {
      console.error("Payment verification failed:", error);
      setPaymentStatus("failed");
      toast.error("Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-base sm:text-lg font-three text-gray-600 dark:text-gray-400">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {paymentStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Icon */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <HiCheckCircle className="w-10 h-10 sm:w-16 sm:h-16 text-green-600 dark:text-green-400" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-one">
              Payment Successful!
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 font-three px-4">
              Thank you! Your order has been confirmed and will be processed
              shortly.
            </p>

            {/* Order Summary Card */}
            {orderData && (
              <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-left max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-one text-gray-900 dark:text-white text-center">
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {/* Order Items */}
                  {orderData.items && orderData.items.length > 0 && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-medium font-three text-gray-900 dark:text-white mb-3">
                        Items Ordered:
                      </h3>
                      <div className="space-y-2">
                        {orderData.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-600 dark:text-gray-400 font-three">
                              {item.quantity}x {item.product?.name || "Product"}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white font-three">
                              {formatCurrency(item.totalAmount || 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-three">
                        Order ID:
                      </span>
                      <p className="font-medium font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">
                        #{orderData.orderId}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-three">
                        Reference:
                      </span>
                      <p className="font-medium font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">
                        {orderData.reference}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-three">
                        Amount Paid:
                      </span>
                      <p className="font-bold text-lg text-green-600 dark:text-green-400 font-one">
                        {formatCurrency(orderData.amount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-three">
                        Status:
                      </span>
                      <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                        {orderData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button
                onClick={handleGoToDashboard}
                className="w-full sm:w-auto px-6 py-3 font-three text-sm sm:text-base"
                size="lg"
              >
                <HiHome className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                onClick={handleContinueShopping}
                variant="secondary"
                className="w-full sm:w-auto px-6 py-3 font-three text-sm sm:text-base"
                size="lg"
              >
                <HiShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 font-three">
                📧 A confirmation email has been sent to your email address with
                order details.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Payment Failed State */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Error Icon */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <HiXCircle className="w-10 h-10 sm:w-16 sm:h-16 text-red-600 dark:text-red-400" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-one">
              Payment Failed
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 font-three px-4 max-w-2xl mx-auto">
              We couldn't process your payment. Please try again or contact
              support if the problem persists.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button
                onClick={handleContinueShopping}
                className="w-full sm:w-auto px-6 py-3 font-three text-sm sm:text-base"
                size="lg"
              >
                <HiShoppingBag className="w-5 h-5 mr-2" />
                Back to Shop
              </Button>
              <Link to="/contact">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto px-6 py-3 font-three text-sm sm:text-base"
                  size="lg"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
