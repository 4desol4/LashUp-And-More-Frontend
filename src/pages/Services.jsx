import { useState } from "react";
import { motion } from "framer-motion";
import { HiClock, HiStar } from "react-icons/hi";
import { SERVICES, ANIMATION_VARIANTS } from "@/utils/constants";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BookingForm from "@/components/booking/BookingForm";

const Services = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4); // show 4 services initially

  const handleBookClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white dark:from-charcoal-900 dark:to-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="text-center max-w-3xl mx-auto"
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
            {SERVICES.slice(0, visibleCount).map((service, index) => (
              <motion.div
                key={service.id}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={ANIMATION_VARIANTS.fadeInUp}
                transition={{ delay: index * 0.05 }} // reduced delay for faster load
              >
                <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="md:flex flex-1">
                    {/* Image */}
                    <div className="md:w-1/2">
                      <img
                        src={service.image}
                        alt={service.name}
                        loading="lazy"
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
                          <span className="font-medium">{service.price}</span>
                        </div>

                        <div className="flex items-center text-sm font-three text-gray-600 dark:text-gray-400">
                          <HiClock className="w-4 h-4 mr-2 text-primary-600" />
                          <span>{service.duration}</span>
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

                      {/* Book Button at bottom */}
                      <Button
                        className="w-full font-three mt-auto"
                        onClick={() => handleBookClick(service.id)}
                      >
                        Book {service.name}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < SERVICES.length && (
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

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-one text-white mb-6">
              Ready to Transform Your Look?
            </h2>
            <p className="text-xl font-three text-primary-100 mb-8 max-w-2xl mx-auto">
              Book your appointment today and let our expert lash artists create
              the perfect look for you.
            </p>
            <div className="flex flex-col font-three sm:flex-row gap-4 justify-center">
              <Link to="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary-600 hover:bg-primary-200 hover:text-white"
                >
                  View Gallery
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary-600 hover:bg-primary-200"
                onClick={() => handleBookClick(null)}
              >
                Book Appointment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        title="Book Appointment"
        size="lg"
      >
        <BookingForm
          initialServiceId={selectedServiceId}
          onSuccess={() => setShowBookingForm(false)}
          onCancel={() => setShowBookingForm(false)}
        />
      </Modal>
    </div>
  );
};

export default Services;
