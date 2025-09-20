import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { PLACEHOLDER_IMAGES } from "@/utils/constants";
import { useServices } from "@/hooks/useServices";
import LoadingSpinner from "@/components/ui/Spinner";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const ServiceCard = ({ service }) => (
  <motion.div variants={cardVariants} className="group relative">
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-charcoal-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={service.imageUrl || PLACEHOLDER_IMAGES.service}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
          <h3 className="text-xl font-one text-white mb-2">{service.name}</h3>
          <p className="text-sm font-three text-gray-200 line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-one text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-600 font-three dark:text-gray-400 text-sm line-clamp-2">
          {service.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {service.features?.slice(0, 2).map((feature, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 font-three bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-one text-primary-600 dark:text-primary-400">
            ₦{service.price}
          </span>
          <span className="text-xs font-three text-gray-500 dark:text-gray-400">
            {service.duration}h
          </span>
        </div>
        <Link to={`/services#${service.id}`}>
          <Button
            variant="outline"
            className="w-full mt-4 font-three group-hover:bg-primary-600 group-hover:text-white transition-all duration-300"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

const ServicesSection = () => {
  const { services, loading } = useServices();

  if (loading && services.length === 0) {
    return (
      <section className="py-20 text-center">
        <LoadingSpinner size="lg" />
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-charcoal-800/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            variants={cardVariants}
            className="inline-block font-four text-primary-600 dark:text-primary-400 font-bold text-xl mb-3 tracking-wide"
          >
            Our Services
          </motion.span>
          <motion.h2
            variants={cardVariants}
            className="text-4xl md:text-5xl font-one text-charcoal-900 dark:text-white mb-4"
          >
            We Love What We Do
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="text-lg text-charcoal-900 font-three font-semibold dark:text-white max-w-2xl mx-auto"
          >
            Transform your natural beauty with our professional eyelash
            services.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.slice(0, 4).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 bg-white dark:bg-charcoal-800 rounded-2xl p-8 md:p-12 shadow-lg max-w-4xl mx-auto text-center"
        >
          <h3 className="text-2xl md:text-3xl font-one text-gray-900 dark:text-white mb-3">
            Ready to Transform Your Look?
          </h3>
          <p className="text-gray-600 font-three font-semibold dark:text-gray-400 mb-6 text-lg">
            Book your appointment today and let our expert lash artists create
            the perfect look for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-three">
            <Link to="/services">
              <Button size="lg" className="px-8">
                View All Services
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
