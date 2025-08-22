import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FadeInUp from "@/components/animations/FadeInUp";
import Button from "@/components/ui/Button";
import { productsAPI } from "@/services/products";
import ProductCard from "@/components/products/ProductCard";
import ProductModal from "@/components/products/ProductModal";
import toast from "react-hot-toast";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    let interval;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAllProducts();
        const activeProducts = response?.data?.filter((p) => p.isActive) ?? [];
        setProducts(activeProducts);
        setError(null);
        clearInterval(interval);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setError(
            `Server unavailable, retrying... (${retryCount + 1}/${maxRetries})`
          );
        } else {
          setError("Failed to load products after multiple attempts.");
          clearInterval(interval);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    interval = setInterval(fetchProducts, 5000);

    return () => clearInterval(interval);
  }, [retryCount]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-charcoal-800 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-charcoal-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-rosegold-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-200/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInUp className="text-center mb-16">
          <motion.span
            className="inline-block text-primary-600 font-four dark:text-primary-400 font-bold text-lg mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Products
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-one text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Premium Beauty Products
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 font-three dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our curated collection of premium lash products designed to
            enhance your natural beauty and maintain your gorgeous lashes at
            home.
          </motion.p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>

        <FadeInUp className="text-center">
          <Link to="/shop">
            <Button size="lg" className="px-8 font-three">
              View All Products
            </Button>
          </Link>
        </FadeInUp>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductsSection;
