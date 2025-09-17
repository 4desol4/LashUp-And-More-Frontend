import { useState, useEffect } from "react";
import { bookingsAPI } from "@/services/bookings";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export const useBookings = (isAdmin = false) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchBookings = async (retryCount = 3, delay = 5000) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = isAdmin
        ? await bookingsAPI.getAllBookings()
        : await bookingsAPI.getUserBookings();

      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      if (retryCount > 0) {
        setTimeout(() => fetchBookings(retryCount - 1, delay), delay);
      } else {
        const message =
          err.response?.data?.message || "Failed to fetch bookings";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingsAPI.createBooking(bookingData);
      setBookings((prev) => [response.data.booking, ...prev]);

      toast.success("Booking created successfully!");
      return { success: true, data: response.data.booking };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create booking";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);

      await bookingsAPI.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to cancel booking";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    try {
      setLoading(true);
      setError(null);

      await bookingsAPI.updateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast.success("Booking status updated successfully!");
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update booking status";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, isAdmin]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    updateBookingStatus,
    refetch: fetchBookings,
  };
};
