import { useState } from "react";
import { motion } from "framer-motion";
import { HiClock, HiStar } from "react-icons/hi";
import { ANIMATION_VARIANTS } from "@/utils/constants";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/Spinner";
import { useServices } from "@/hooks/useServices";
import { formatCurrency } from "@/utils/formatters";

const Services = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const { services, loading } = useServices();

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white dark:from-charcoal-900 dark:to-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-one text-gray-900 dark:text-white mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl text-gray-600 font-three dark:text-gray-400 leading-relaxed">
              Transform your natural beauty with our professional eyelash
              services. Each treatment is carefully crafted to enhance your
              unique features.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.slice(0, visibleCount).map((service, index) => (
              <motion.div
                key={service.id}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={ANIMATION_VARIANTS.fadeInUp}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="md:flex flex-1">
                    {/* Image */}
                    <div className="md:w-1/2">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 p-8 flex flex-col">
                      <h3 className="text-2xl font-one text-gray-900 dark:text-white mb-4">
                        {service.name}
                      </h3>

                      <p className="text-gray-600 font-three dark:text-gray-400 mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Service Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600 font-three dark:text-gray-400">
                          <span className="text-primary-600 font-bold mr-2">
                            ₦
                          </span>
                          <span className="font-medium">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm font-three text-gray-600 dark:text-gray-400">
                          <HiClock className="w-4 h-4 mr-2 text-primary-600" />
                          <span>{service.duration}h</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-three font-semibold text-lg text-gray-900 dark:text-white mb-3">
                          What's Included:
                        </h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm font-three text-gray-600 dark:text-gray-400"
                            >
                              <HiStar className="w-3 h-3 mr-2 text-primary-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < services.length && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 4)}
              >
                Load More Services
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
