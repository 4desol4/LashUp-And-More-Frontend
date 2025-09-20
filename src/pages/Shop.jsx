import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductGrid from "@/components/products/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { HiShoppingCart, HiX } from "react-icons/hi";
import { formatCurrency } from "@/utils/formatters";
import { ANIMATION_VARIANTS } from "@/utils/constants";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const Shop = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, itemCount } =
    useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white dark:from-charcoal-900 dark:to-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-one text-charcoal-900 font-four dark:text-white mb-6">
              Lash <span className="text-gradient">Products</span>
            </h1>
            <p className="text-xl font-three text-charcoal-700 dark:text-white leading-relaxed">
              Professional-grade lash products to maintain and enhance your
              beautiful lashes at home.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products */}
          <div className="lg:col-span-3">
            <ProductGrid />
          </div>

          {/* Shopping Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Shopping Cart
                  </h3>
                  <div className="flex items-center space-x-1">
                    <HiShoppingCart className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-primary-600">
                      {itemCount}
                    </span>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <HiShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-charcoal-700 rounded-lg"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatCurrency(item.price)}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <HiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 dark:border-charcoal-600 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Subtotal
                        </span>
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(getTotalPrice())}
                        </span>
                      </div>

                      {/* Checkout Button */}
                      {isAuthenticated ? (
                        <Link to="/checkout">
                          <Button className="w-full font-three">
                            Proceed to Checkout
                          </Button>
                        </Link>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Please login to checkout
                          </p>
                          <Button
                            className="w-full font-three"
                            onClick={() => openAuthModal("login")}
                          >
                            Login to Continue
                          </Button>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                        Shipping calculated at checkout
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
