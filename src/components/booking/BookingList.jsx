import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiCalendar, HiClock } from "react-icons/hi";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/context/AuthContext";
import BookingCard from "./BookingCard";
import LoadingSpinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/helpers";

const BookingList = ({ isAdmin = false }) => {
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { isAuthenticated } = useAuth();
  
  const { 
    bookings, 
    loading, 
    updateBookingStatus, 
    cancelBooking 
  } = useBookings(isAdmin);

  const statusFilters = [
    { id: "all", label: "All Bookings" },
    { id: "PENDING", label: "Pending" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter]);

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
      await updateBookingStatus(bookingId, newStatus);
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId);
    }
  };

  if (loading && bookings.length === 0) {
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
            {isAdmin ? "Manage customer bookings" : "Track your appointment history"}
          </p>
        </div>
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
                {bookings.filter((booking) => booking.status === filter.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
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
              : "Book a service to see your appointments here."}
          </p>
          {!isAdmin && (
            <Button
              className="font-three"
              onClick={() => (window.location.href = "/services")}
            >
              Book a Service
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
                onStatusChange={isAdmin ? handleStatusChange : undefined}
                onCancel={!isAdmin ? handleCancelBooking : undefined}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;