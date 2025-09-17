import React from "react";
import { HiCalendar, HiClock, HiUser, HiPhone } from "react-icons/hi";
import { dateFormatters, formatCurrency } from "@/utils/formatters";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/helpers";

const BookingCard = ({
  booking,
  isAdmin = false,
  onStatusChange,
  onCancel,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
    }
  };

  const canCancel = !isAdmin && booking.status === "PENDING";
  const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Booking Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-one text-gray-900 dark:text-white mb-1">
                {booking.service?.name || "Service"}
              </h3>
              <p className="text-sm text-gray-600 font-three dark:text-gray-400 mb-2">
                {booking.service?.description || "Service booking"}
              </p>
              {booking.service?.price && (
                <p className="text-lg font-one text-primary-600">
                  {formatCurrency(booking.service.price)}
                </p>
              )}
            </div>

            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                getStatusColor(booking.status)
              )}
            >
              {booking.status}
            </span>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <HiCalendar className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                <p className="font-medium font-three text-gray-900 dark:text-white">
                  {dateFormatters.toReadable(booking.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <HiClock className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-gray-500 dark:text-gray-400">Time:</span>
                <p className="font-medium font-three text-gray-900 dark:text-white">
                  {dateFormatters.toTime(booking.date)}
                </p>
              </div>
            </div>

            {booking.service?.duration && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Duration:
                </span>
                <p className="font-medium font-three text-gray-900 dark:text-white">
                  {booking.service.duration} hours
                </p>
              </div>
            )}

            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Booking ID:
              </span>
              <p className="font-medium font-three text-gray-900 dark:text-white font-mono">
                #{booking.id.slice(-8).toUpperCase()}
              </p>
            </div>

            {isAdmin && booking.user && (
              <>
                <div className="flex items-center space-x-2">
                  <HiUser className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Customer:
                    </span>
                    <p className="font-medium font-three text-gray-900 dark:text-white">
                      {booking.user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <HiPhone className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Email:
                    </span>
                    <p className="font-medium font-three text-gray-900 dark:text-white">
                      {booking.user.email}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Notes:
              </span>
              <p className="font-three text-gray-900 dark:text-white mt-1">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {/* User Cancel Button */}
            {canCancel && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(booking.id)}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel Booking
              </Button>
            )}

            {/* Admin Status Update */}
            {isAdmin && onStatusChange && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </label>
                <select
                  value={booking.status}
                  onChange={(e) => onStatusChange(booking.id, e.target.value)}
                  className="px-3 py-1 text-sm border rounded-md bg-white dark:bg-charcoal-800 border-gray-300 dark:border-charcoal-600 text-gray-900 dark:text-white"
                >
                  {allowedStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Service Image */}
        {booking.service?.imageUrl && (
          <div className="lg:w-48">
            <img
              src={booking.service.imageUrl}
              alt={booking.service.name}
              className="w-full h-32 lg:h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;
