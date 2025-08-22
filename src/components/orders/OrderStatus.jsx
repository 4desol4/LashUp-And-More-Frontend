import { cn } from '@/utils/helpers';

const OrderStatus = ({ status, className }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700'
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700'
        };
      case 'SHIPPED':
        return {
          label: 'Shipped',
          className: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700'
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
};

export default OrderStatus;