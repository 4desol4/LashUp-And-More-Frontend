import api from './api';

export const bookingsAPI = {
  // Create new booking
  createBooking: (bookingData) => {
    return api.post('/bookings', bookingData);
  },

  // Get user's bookings
  getUserBookings: () => {
    return api.get('/bookings/me');
  },

  // Cancel booking
  cancelBooking: (bookingId) => {
    return api.put(`/bookings/${bookingId}/cancel`);
  },

  // Admin: Get all bookings
  getAllBookings: () => {
    return api.get('/bookings');
  },

  // Admin: Update booking status
  updateBookingStatus: (bookingId, status) => {
    return api.put(`/bookings/${bookingId}/status`, { status });
  },

  // Get available time slots (if implemented)
  getAvailableSlots: (date, service) => {
    return api.get(`/bookings/availability`, {
      params: { date, service }
    });
  }
};