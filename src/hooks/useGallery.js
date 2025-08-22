import { useState, useEffect } from 'react';
import { galleryAPI } from '@/services/gallery';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export const useGallery = (isAdmin = false) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchGalleryItems = async (retryCount = 3, delay = 5000) => {
    try {
      setLoading(true);
      setError(null);

      const response = await galleryAPI.getGalleryItems();
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching gallery items:', err);
      if (retryCount > 0) {
        setTimeout(() => fetchGalleryItems(retryCount - 1, delay), delay);
      } else {
        const message = err.response?.data?.message || 'Failed to fetch gallery items';
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addGalleryItem = async (itemData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      const response = await galleryAPI.addGalleryItem(itemData);
      setItems(prev => [response.data, ...prev]);

      toast.success('Gallery item added successfully!');
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add gallery item';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (itemId) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      await galleryAPI.deleteGalleryItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));

      toast.success('Gallery item deleted successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete gallery item';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getItemsByType = (type) => {
    return items.filter(item => item.type === type);
  };

  useEffect(() => {
    if (isAuthenticated) fetchGalleryItems();
  }, [isAuthenticated]);

  return {
    items,
    loading,
    error,
    fetchGalleryItems,
    addGalleryItem,
    deleteGalleryItem,
    getItemsByType,
    refetch: fetchGalleryItems
  };
};
