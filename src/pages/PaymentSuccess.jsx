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
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-three text-gray-600 dark:text-gray-400">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-charcoal-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {paymentStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <HiCheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Thank you! Your order has been confirmed.
            </p>

            {orderData && (
              <Card className="p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="text-left space-y-2">
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    {orderData.orderId}
                  </p>
                  <p>
                    <span className="font-medium">Reference:</span>{" "}
                    {orderData.reference}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {formatCurrency(orderData.amount)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="text-green-600 font-medium">
                      {orderData.status}
                    </span>
                  </p>
                </div>
              </Card>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={handleGoToDashboard} leftIcon={<HiHome />}>
                Go to Dashboard
              </Button>
              <Button
                onClick={handleContinueShopping}
                leftIcon={<HiShoppingBag />}
                variant="secondary"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <HiXCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Something went wrong while verifying your payment. Please try
              again or contact support.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleContinueShopping}
                leftIcon={<HiShoppingBag />}
              >
                Back to Shop
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
