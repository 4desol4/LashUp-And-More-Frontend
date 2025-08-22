import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { HiCalendar, HiClock, HiUser } from "react-icons/hi";
import { bookingsAPI } from "@/services/bookings";
import { useAuth } from "@/context/AuthContext";
import { SERVICES, TIME_SLOTS } from "@/utils/constants";
import { dateFormatters } from "@/utils/formatters";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ServiceSelector from "./ServiceSelector";
import AuthModal from "@/components/auth/AuthModal";
const bookingSchema = yup.object().shape({
  service: yup.string().required("Please select a service"),
  date: yup
    .date()
    .required("Please select a date")
    .min(new Date(), "Date cannot be in the past"),
  time: yup.string().required("Please select a time"),
});

const BookingForm = ({ onSuccess, onCancel, initialServiceId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      service: initialServiceId || "",
      date: "",
      time: "",
    },
  });

  const watchedService = watch("service");

  useEffect(() => {
    if (watchedService) {
      const service = SERVICES.find((s) => s.id === watchedService);
      setSelectedService(service);
    }
  }, [watchedService]);

  const getMinDate = () => {
    const today = new Date();
    return dateFormatters.toInputValue(today);
  };

  const getAvailableTimeSlots = () => {
    return TIME_SLOTS;
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to make a booking");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!data.date || !data.time) {
        toast.error("Please select both date and time");
        setIsSubmitting(false);
        return;
      }

      let bookingDate;
      if (data.date instanceof Date) {
        bookingDate = new Date(data.date);
      } else if (typeof data.date === "string") {
        const [year, month, day] = data.date.split("-").map(Number);
        bookingDate = new Date(year, month - 1, day);
      } else {
        throw new Error("Invalid date format");
      }

      const [hours, minutes] = data.time.split(":").map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);

      if (isNaN(bookingDate.getTime())) {
        throw new Error("Invalid date/time selection");
      }

      const bookingData = {
        service: data.service,
        date: bookingDate.toISOString(),
        notes: data.notes || null,
      };

      await bookingsAPI.createBooking(bookingData);

      toast.success("Booking created successfully!");
      reset();
      setSelectedService(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Booking error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Card className="text-center p-8">
          <div className="mb-6">
            <HiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-one text-gray-900 dark:text-white mb-2">
              Login Required
            </h3>
            <p className="text-gray-600 font-three dark:text-gray-400">
              Please login to your account to make a booking.
            </p>
          </div>
          <div className="space-x-4 font-three">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowAuthModal(true);
              }}
            >
              Login
            </Button>
          </div>
        </Card>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-one  text-gray-900 dark:text-white mb-2">
            Book Your Appointment
          </h2>
          <p className="text-gray-600 font-three dark:text-gray-400">
            Choose your service and preferred time. We'll confirm your booking
            shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-one text-gray-900 dark:text-white mb-3">
              Select Service *
            </label>
            <ServiceSelector
              services={SERVICES}
              selectedService={watchedService}
              onServiceSelect={(serviceId) => setValue("service", serviceId)}
              error={errors.service?.message}
            />
          </div>

          {/* Selected Service Preview */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-one text-gray-900 dark:text-white">
                    {selectedService.name}
                  </h4>
                  <p className="text-base font-three text-gray-600 dark:text-gray-400">
                    {selectedService.price} • {selectedService.duration}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold font-three text-gray-900 dark:text-white mb-2">
                <HiCalendar className="inline w-4 h-4 mr-1 " />
                Date *
              </label>
              <Input
                type="date"
                min={getMinDate()}
                {...register("date")}
                error={errors.date?.message}
                className="w-full font-three"
              />
            </div>

            <div>
              <label className="block text-base font-bold  font-three text-gray-900 dark:text-white mb-2">
                <HiClock className="inline w-4 h-4 mr-1" />
                Time *
              </label>
              <select
                {...register("time")}
                className="w-full px-4 py-3 border font-three font-bold border-gray-300 dark:border-charcoal-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white"
              >
                <option value="">Select a time</option>
                {getAvailableTimeSlots().map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-base font-three text-red-600">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 dark:bg-charcoal-800 rounded-lg ">
            <h4 className="font-one text-gray-900 dark:text-white mb-2">
              Booking for:
            </h4>
            <p className="text-gray-600 font-three dark:text-gray-400">
              {user?.name} • {user?.email}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col font-three sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default BookingForm;
