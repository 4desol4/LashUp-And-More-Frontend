import { useState, useEffect } from 'react';
import { servicesAPI } from '@/services/services';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export const useServices = (isAdmin = false) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchServices = async (retryCount = 3, delay = 5000) => {
    try {
      setLoading(true);
      setError(null);

      const response = await servicesAPI.getAllServices();
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      if (retryCount > 0) {
        setTimeout(() => fetchServices(retryCount - 1, delay), delay);
      } else {
        const message = err.response?.data?.message || 'Failed to fetch services';
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      const response = await servicesAPI.createService(serviceData);
      setServices(prev => [response.data.service, ...prev]);

      toast.success('Service created successfully!');
      return { success: true, data: response.data.service };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create service';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId, serviceData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      const response = await servicesAPI.updateService(serviceId, serviceData);
      setServices(prev =>
        prev.map(service => service.id === serviceId ? response.data.service : service)
      );

      toast.success('Service updated successfully!');
      return { success: true, data: response.data.service };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update service';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };

    try {
      setLoading(true);
      setError(null);

      await servicesAPI.deleteService(serviceId);
      setServices(prev => prev.filter(service => service.id !== serviceId));

      toast.success('Service deleted successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete service';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices
  };
};