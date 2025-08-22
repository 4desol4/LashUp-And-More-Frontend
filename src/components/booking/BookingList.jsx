import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiPlus, HiCalendar, HiFilter } from "react-icons/hi";
import { bookingsAPI } from "@/services/bookings";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/Spinner";
import BookingCard from "./BookingCard";
import BookingForm from "./BookingForm";
import Modal from "@/components/ui/Modal";
import { BOOKING_STATUSES } from "@/utils/constants";
import { cn } from "@/utils/helpers";
import toast from "react-hot-toast";

const BookingList = ({ isAdmin = false }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { isAuthenticated } = useAuth();

  const statusFilters = [
    { id: "all", label: "All Bookings" },
    { id: "PENDING", label: "Pending" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = isAdmin
        ? await bookingsAPI.getAllBookings()
        : await bookingsAPI.getUserBookings();

      // Handle response structure - your backend returns the array directly or in a data wrapper
      const bookingsData = Array.isArray(response.data)
        ? response.data
        : response;
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((booking) => booking.status === statusFilter)
      );
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateBookingStatus(bookingId, newStatus);
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      toast.success("Booking status updated successfully");
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to cancel this booking?</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id); 
                try {
                  await bookingsAPI.cancelBooking(bookingId);
                  setBookings((prev) =>
                    prev.map((booking) =>
                      booking.id === bookingId
                        ? { ...booking, status: "CANCELLED" }
                        : booking
                    )
                  );
                  toast.success("Booking cancelled successfully!");
                } catch (error) {
                  console.error("Error cancelling booking:", error);
                  toast.error("Failed to cancel booking");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 border rounded-md"
            >
              Keep Booking
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-one text-gray-900 dark:text-white">
            {isAdmin ? "All Bookings" : "My Bookings"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-three">
            {isAdmin
              ? "Manage customer bookings"
              : "Manage your appointment bookings"}
          </p>
        </div>

        {!isAdmin && (
          <Button
            onClick={() => setShowBookingForm(true)}
            className="w-full sm:w-auto font-three"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            New Booking
          </Button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 font-three">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              statusFilter === filter.id
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-charcoal-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            )}
          >
            {filter.label}
            {filter.id !== "all" && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {
                  bookings.filter((booking) => booking.status === filter.id)
                    .length
                }
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredBookings.length} booking
          {filteredBookings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-one text-gray-900 dark:text-white mb-2">
            {statusFilter === "all"
              ? "No bookings yet"
              : `No ${statusFilter.toLowerCase()} bookings`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-three">
            {isAdmin
              ? "No bookings match the selected filter."
              : "Book your first appointment to get started with our services."}
          </p>
          {!isAdmin && (
            <Button
              className="font-three"
              onClick={() => setShowBookingForm(true)}
            >
              <HiPlus className="w-5 h-5 mr-2" />
              Make Your First Booking
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookingCard
                booking={booking}
                isAdmin={isAdmin}
                onCancel={!isAdmin ? handleCancelBooking : undefined}
                onStatusChange={isAdmin ? handleStatusChange : undefined}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Form Modal - Only for non-admin users */}
      {!isAdmin && (
        <Modal
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          title="New Booking"
          size="lg"
        >
          <BookingForm
            onSuccess={handleBookingSuccess}
            onCancel={() => setShowBookingForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default BookingList;
