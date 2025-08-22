import { useState } from 'react';
import { HiMinus, HiPlus, HiShoppingCart } from 'react-icons/hi';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ordersAPI } from '@/services/orders'; 
import toast from 'react-hot-toast';
const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();


  const images = [product.imageUrl, product.imageUrl, product.imageUrl];

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    onClose();
  };

  const handleOrderNow = async () => {
    try {
      await ordersAPI.createOrder({
        productId: product.id,
        quantity,
      });
      toast.success('Order placed successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-charcoal-700">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-primary-500'
                    : 'border-gray-200 dark:border-charcoal-600'
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
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 border border-gray-300 dark:border-charcoal-600 rounded-lg hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border border-gray-300 dark:border-charcoal-600 rounded-lg min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 border border-gray-300 dark:border-charcoal-600 rounded-lg hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <HiShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - {formatCurrency(product.price * quantity)}
            </Button>

            <Button onClick={handleOrderNow} className="w-full bg-primary-600 hover:bg-primary-700 text-white" size="lg">
              Order Now - {formatCurrency(product.price * quantity)}
            </Button>
          </div>

          {/* Product Features */}
          <div className="border-t border-gray-200 dark:border-charcoal-700 pt-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Product Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• High-quality materials</li>
              <li>• Long-lasting formula</li>
              <li>• Professional grade</li>
              <li>• Easy application</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
