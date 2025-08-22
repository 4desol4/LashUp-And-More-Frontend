import React from 'react';
import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { cn } from '@/utils/helpers';

const ServiceSelector = ({ services, selectedService, onServiceSelect, error }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedService === service.id;
          
          return (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onServiceSelect(service.id)}
              className={cn(
                'relative cursor-pointer rounded-lg border-2 transition-all duration-200 overflow-hidden',
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-charcoal-600 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-charcoal-800'
              )}
            >
              {/* Service Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center"
                  >
                    <HiCheck className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Service Info */}
              <div className="p-4">
                <h3 className="font-one text-gray-900 dark:text-white mb-1">
                  {service.name}
                </h3>
                <p className="text-base font-three text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-one text-primary-600">
                    {service.price}
                  </span>
                  <span className="text-sm font-three text-gray-500 dark:text-gray-400">
                    {service.duration}
                  </span>
                </div>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {service.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="text-sm px-2 py-1 font-three bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-400 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {service.features.length > 2 && (
                    <span className="text-sm px-2 py-1 font-three bg-gray-100 dark:bg-charcoal-700 text-gray-600 dark:text-gray-400 rounded-full">
                      +{service.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {error && (
        <p className="mt-2 text-base font-three text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ServiceSelector;