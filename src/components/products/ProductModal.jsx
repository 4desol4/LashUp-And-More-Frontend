import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMinus, HiPlus, HiShoppingCart, HiCreditCard } from "react-icons/hi";
import { formatCurrency } from "@/utils/formatters";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addItem, clearCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const images = [product.imageUrl, product.imageUrl, product.imageUrl];

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} ${product.name}(s) to cart!`);
    onClose();
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      openAuthModal("login");
      return;
    }

    try {
      setLoading(true);

      // Clear existing cart and add this product
      clearCart();
      addItem(product, quantity);

      // Navigate to checkout
      navigate("/checkout");
      onClose();

      toast.success("Proceeding to checkout...");
    } catch (error) {
      console.error("Order now error:", error);
      toast.error("Failed to proceed to checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-primary-500"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4 lg:space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 font-one">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-primary-600 font-one">
              {formatCurrency(product.price)}
            </p>
          </div>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-three">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white font-three">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg min-w-[60px] text-center font-three font-medium">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Total Price Display */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-900 dark:text-white font-three">
                Total Price:
              </span>
              <span className="text-xl font-bold text-primary-600 font-one">
                {formatCurrency(product.price * quantity)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full font-three text-sm sm:text-base"
              size="lg"
              variant="secondary"
            >
              <HiShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {/* Order Now Button */}
            <Button
              onClick={handleOrderNow}
              className="w-full font-three text-sm sm:text-base"
              size="lg"
              loading={loading}
              disabled={loading}
            >
              <HiCreditCard className="w-5 h-5 mr-2" />
              {loading ? "Processing..." : "Order Now - Buy Instantly"}
            </Button>

            {/* Auth reminder for non-authenticated users */}
            {!isAuthenticated && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center font-three">
                💡 Login required for instant ordering
              </p>
            )}
          </div>

          {/* Product Features */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 lg:pt-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 font-one">
              Product Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 font-three">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                High-quality materials
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                Long-lasting formula
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                Professional grade
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                Easy application
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></span>
                Safe for sensitive skin
              </li>
            </ul>
          </div>

          {/* Shipping Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 font-three">
              🚚 Shipping Information
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 font-three">
              <li>• Free shipping on orders over ₦50,000</li>
              <li>• Express delivery available (2-5 business days)</li>
              <li>• Secure packaging guaranteed</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
