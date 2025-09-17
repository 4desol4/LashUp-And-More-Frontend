import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { paymentAPI } from "@/services/payment";
import { formatCurrency } from "@/utils/formatters";
import {
  HiShoppingBag,
  HiUser,
  HiLocationMarker,
  HiPhone,
  HiMail,
} from "react-icons/hi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const shippingSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup.string(),
});

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
    },
  });

  const SHIPPING_FEE = 10;
  const subtotal = getTotalPrice();
  const total = subtotal + SHIPPING_FEE;

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      navigate("/");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/shop");
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const paymentData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingInfo: data,
      };

      const response = await paymentAPI.initializePayment(paymentData);

      if (response.data.payment_url) {
        // Store order reference for later verification
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            reference: response.data.reference,
            items: items,
          })
        );

        // Clear cart
        clearCart();

        // Redirect to Paystack
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const message =
        error.response?.data?.message || "Failed to initialize payment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-one text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 font-three dark:text-gray-400">
            Complete your order and shipping information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <HiUser className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-one text-gray-900 dark:text-white">
                  Shipping Information
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Your first name"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Your last name"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="08012345678"
                    {...register("phone")}
                    error={errors.phone?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                    Address *
                  </label>
                  <Input
                    type="text"
                    placeholder="Street address"
                    {...register("address")}
                    error={errors.address?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                      City *
                    </label>
                    <Input
                      type="text"
                      placeholder="Lagos"
                      {...register("city")}
                      error={errors.city?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                      State *
                    </label>
                    <select
                      {...register("state")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-charcoal-600 rounded-lg bg-white dark:bg-charcoal-800 text-gray-900 dark:text-white font-three focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium font-three text-gray-900 dark:text-white mb-2">
                      Postal Code
                    </label>
                    <Input
                      type="text"
                      placeholder="100001"
                      {...register("postalCode")}
                      error={errors.postalCode?.message}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-three"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : `Pay ${formatCurrency(total)} with Paystack`}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <HiShoppingBag className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-one text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium font-three text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-three dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium font-three text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-charcoal-700 pt-4 space-y-2">
                <div className="flex justify-between font-three">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between font-three">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(SHIPPING_FEE)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold font-one border-t border-gray-200 dark:border-charcoal-700 pt-2">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <h3 className="font-medium font-three text-primary-900 dark:text-primary-100 mb-2">
                  Payment Security
                </h3>
                <p className="text-sm font-three text-primary-800 dark:text-primary-200">
                  Your payment is secured by Paystack. We accept all major cards
                  and bank transfers.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
