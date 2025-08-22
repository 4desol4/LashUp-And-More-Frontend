import { motion } from 'framer-motion';
import {  HiShoppingCart } from 'react-icons/hi';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const ProductCard = ({ product, onClick }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="p-0 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          

        
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="flex items-center space-x-1"
            >
              <HiShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
