import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/products';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();


  const fetchAllProducts = async (retryCount = 3, delay = 5000) => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.getAllProducts();
      setProducts(response.data); 
    } catch (error) {
      console.error('Error fetching products:', error);
      if (retryCount > 0) {
        console.warn(`Retrying fetch... attempts left: ${retryCount}`);
        setTimeout(() => fetchAllProducts(retryCount - 1, delay), delay);
      } else {
        const message = error.response?.data?.message || 'Failed to fetch products';
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.createProduct(productData);
      setProducts(prev => [response.data, ...prev]);

      toast.success('Product created successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.updateProduct(productId, productData);
      setProducts(prev =>
        prev.map(product => product.id === productId ? response.data : product)
      );

      toast.success('Product updated successfully!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      await productsAPI.deleteProduct(productId);
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? { ...product, isActive: false }
            : product
        )
      );

      toast.success('Product deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllProducts();
    }
  }, [isAdmin]);

  return {
    products,
    loading,
    error,
    fetchAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchAllProducts,
  };
};
