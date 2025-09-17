import api from './api';

export const servicesAPI = {
  // Get all services
  getAllServices: () => {
    return api.get('/services');
  },

  // Get single service
  getService: (serviceId) => {
    return api.get(`/services/${serviceId}`);
  },

  // Admin: Create service
  createService: (serviceData) => {
    return api.post('/services', serviceData);
  },

  // Admin: Update service
  updateService: (serviceId, serviceData) => {
    return api.put(`/services/${serviceId}`, serviceData);
  },

  // Admin: Delete service
  deleteService: (serviceId) => {
    return api.delete(`/services/${serviceId}`);
  }
};