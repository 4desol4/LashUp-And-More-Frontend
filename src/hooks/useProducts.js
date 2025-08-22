import { useState, useEffect } from "react";
import { productsAPI } from "@/services/products";
import toast from "react-hot-toast";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (retryCount = 3, delay = 5000) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.getAllProducts();
      setProducts(response.data.filter((product) => product.isActive));
    } catch (err) {
      console.error("Error fetching products:", err);
      if (retryCount > 0) {
        setTimeout(() => fetchProducts(retryCount - 1, delay), delay);
      } else {
        const message =
          err.response?.data?.message || "Failed to fetch products";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.getProduct(productId);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch product";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.searchProducts(query);
      return { success: true, data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to search products";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    searchProducts,
    refetch: fetchProducts,
  };
};
