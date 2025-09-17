import api from './api';

export const paymentAPI = {
  // Initialize payment with Paystack
  initializePayment: (paymentData) => {
    return api.post('/orders/payment/initialize', paymentData);
  },

  // Verify payment
  verifyPayment: (reference) => {
    return api.get(`/orders/payment/verify/${reference}`);
  }
};