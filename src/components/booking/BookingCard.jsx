import  { useState } from 'react';
import { 
  HiCalendar, 
  HiClock, 
  HiX, 
  HiCheckCircle, 
  HiExclamationCircle,
  HiXCircle,
  HiUser,
  HiPhone,
  HiMail,
  HiChevronDown
} from 'react-icons/hi';
import { dateFormatters, formatCurrency } from '@/utils/formatters';
import { STATUS_COLORS, SERVICES } from '@/utils/constants';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { cn } from '@/utils/helpers';

const BookingCard = ({ booking, onCancel, isAdmin = false, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const service = SERVICES.find(s => s.id === booking.service) || { name: booking.service };
  const canCancel = booking.status === 'PENDING';

  const handleStatusUpdate = async (newStatus) => {
    if (!onStatusChange) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(booking.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(booking.id);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <HiXCircle className="w-4 h-4" />;
      default:
        return <HiExclamationCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'CONFIRMED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-sm border border-gray-200 dark:border-charcoal-700 overflow-hidden">
      
      {/* Main Content */}
      <div className="p-6">
        
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-one text-gray-900 dark:text-white">
                {service.name}
              </h3>
              <Badge className={cn('flex items-center space-x-1 text-xs font-medium px-2 py-1', getStatusColor(booking.status))}>
                {getStatusIcon(booking.status)}
                <span className="capitalize">{booking.status.toLowerCase()}</span>
              </Badge>
            </div>
            
            {isAdmin && booking.user && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <HiUser className="w-4 h-4" />
                <span className="font-three">{booking.user.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <HiCalendar className="w-4 h-4" />
                <span className="font-three">{dateFormatters.toReadable(booking.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiClock className="w-4 h-4" />
                <span className="font-three">{dateFormatters.toTime(booking.date)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {service.price && (
              <span className="text-lg font-one text-primary-600 dark:text-primary-400">
                {service.price}
              </span>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <HiChevronDown className={cn(
                'w-5 h-5 transition-transform duration-200',
                isExpanded ? 'rotate-180' : ''
              )} />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-charcoal-700">
            
            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Service Details */}
              <div>
                <h4 className="font-medium font-one text-gray-900 dark:text-white mb-2">
                  Service Details
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 font-three">
                  <p>Duration: {service.duration || 'N/A'}</p>
                  {service.description && (
                    <p>Description: {service.description}</p>
                  )}
                  {booking.notes && (
                    <p>Notes: {booking.notes}</p>
                  )}
                </div>
              </div>

              {/* Customer Contact (Admin View) */}
              {isAdmin && booking.user && (
                <div>
                  <h4 className="font-medium font-one text-gray-900 dark:text-white mb-2">
                    Customer Contact
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 font-three">
                    {booking.user.phone && (
                      <div className="flex items-center gap-2">
                        <HiPhone className="w-4 h-4" />
                        <span>{booking.user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <HiMail className="w-4 h-4" />
                      <span>{booking.user.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Metadata */}
            <div className="text-xs text-gray-500 dark:text-gray-500 font-three">
              Booking ID: {booking.id.slice(-8).toUpperCase()} • 
              Created {dateFormatters.toRelative(booking.createdAt)}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              
              {/* Admin Actions */}
              {isAdmin && onStatusChange && (
                <>
                  {booking.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate('CONFIRMED')}
                      disabled={isUpdating}
                      className="font-three"
                    >
                      Confirm Booking
                    </Button>
                  )}
                  
                  {canCancel && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate('CANCELLED')}
                      disabled={isUpdating}
                      className="text-red-600 hover:text-red-700 font-three"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </>
              )}

              {/* Customer Actions */}
              {!isAdmin && canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-three"
                >
                  <HiX className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;