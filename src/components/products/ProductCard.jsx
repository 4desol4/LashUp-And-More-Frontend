import { motion } from "framer-motion";
import { HiShoppingCart, HiHeart, HiEye } from "react-icons/hi";
import { formatCurrency } from "@/utils/formatters";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="cursor-pointer group h-full"
      onClick={handleCardClick}
    >
      <Card className="p-0 overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col border-0 shadow-lg hover:shadow-2xl">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick && onClick(product);
                }}
              >
                <HiEye className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Discount badge if applicable */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                % OFF
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-one text-charcoal-900 dark:text-white mb-2 text-sm sm:text-base lg:text-lg line-clamp-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs sm:text-sm text-charcoal-800 dark:text-white mb-3 sm:mb-4 line-clamp-2 leading-relaxed font-three flex-grow">
            {product.description}
          </p>

          {/* Price and Action Section */}
          <div className="mt-auto space-y-3 sm:space-y-4">
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold font-one text-primary-600 dark:text-primary-400">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through font-three">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
              </div>

              {/* Rating if available */}
              {product.rating && (
                <div className="flex items-center">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1 font-three">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 font-three py-2 sm:py-3 text-sm sm:text-base group-hover:bg-primary-700 transition-all duration-300"
              size="sm"
            >
              <HiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>

        {/* Bottom highlight bar */}
        <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
