import api from './api';

export const productsAPI = {
  // Get all products
  getAllProducts: () => {
    return api.get('/products');
  },

  // Get single product
  getProduct: (productId) => {
    return api.get(`/products/${productId}`);
  },

  // Admin: Create product
  createProduct: (productData) => {
    return api.post('/products', productData);
  },

  // Admin: Update product
  updateProduct: (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },

  // Admin: Delete product
  deleteProduct: (productId) => {
    return api.delete(`/products/${productId}`);
  },

  // Search products
  searchProducts: (query) => {
    return api.get('/products', {
      params: { search: query }
    });
  },

  // Filter products by category (if implemented)
  getProductsByCategory: (category) => {
    return api.get('/products', {
      params: { category }
    });
  }
};