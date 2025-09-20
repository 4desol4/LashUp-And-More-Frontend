import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiStar, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import FadeInUp from "@/components/animations/FadeInUp";
import Button from "@/components/ui/Button";

const StarRating = ({ rating, className = "" }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: star * 0.1, duration: 0.5, type: "spring" }}
        >
          <HiStar
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{
        opacity: isActive ? 1 : 0.7,
        x: 0,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`bg-white dark:bg-charcoal-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${
        isActive ? "ring-2 ring-rosegold-300" : ""
      }`}
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10">
        <svg
          className="w-16 h-16 text-rosegold-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
        </svg>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Testimonial Text */}
      <blockquote className="text-gray-700 dark:text-gray-300 font-three text-lg leading-relaxed mb-6 relative z-10">
        "{testimonial.review}"
      </blockquote>

      {/* Client Info */}
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-rosegold-200"
        >
          <img
            src={
              testimonial.clientImage ||
              `https://ui-avatars.com/api/?name=${testimonial.clientName}&background=f3e8ff&color=7c3aed&size=56`
            }
            alt={testimonial.clientName}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div>
          <h4 className="font-one font-semibold text-gray-900 dark:text-white">
            {testimonial.clientName}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-three">
            {testimonial.service} • {testimonial.date}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-rosegold-200/20 to-cream-200/20 rounded-full blur-xl" />
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      service: "Volume Lashes",
      date: "2 weeks ago",
      rating: 5,
      review:
        "Absolutely amazing! My lashes look so natural and beautiful. The team at LashUpAndMore is incredibly professional and skilled. I get compliments everywhere I go!",
      clientImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=56&h=56&fit=crop&crop=face",
    },
    {
      id: 2,
      clientName: "Emily Chen",
      service: "Classic Extensions",
      date: "1 month ago",
      rating: 5,
      review:
        "Perfect results every time! I've been coming here for over a year and the quality is always consistent. My lashes last exactly as long as promised.",
      clientImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=56&h=56&fit=crop&crop=face",
    },
    {
      id: 3,
      clientName: "Adaora Okwu",
      service: "Lash Lift & Tint",
      date: "3 weeks ago",
      rating: 5,
      review:
        "I love how my natural lashes look so much fuller and longer! The lash lift gave me exactly the curl I wanted. Highly recommend this place!",
      clientImage:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=56&h=56&fit=crop&crop=face",
    },
    {
      id: 4,
      clientName: "Jessica Williams",
      service: "Hybrid Lashes",
      date: "2 months ago",
      rating: 5,
      review:
        "The best lash experience I've ever had! The attention to detail is incredible and my lashes looked perfect for my wedding. Thank you so much!",
      clientImage:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=56&h=56&fit=crop&crop=face",
    },
    {
      id: 5,
      clientName: "Fatima Abdul",
      service: "Volume Extensions",
      date: "1 week ago",
      rating: 5,
      review:
        "Outstanding service and results! The studio is clean, comfortable, and the staff makes you feel so welcomed. My lashes are absolutely gorgeous!",
      clientImage:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=56&h=56&fit=crop&crop=face",
    },
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [maxIndex, isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], isActive: i === 1 }); // Middle item is active
    }
    return visible;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-primary-50 to-white dark:from-charcoal-800 dark:to-charcoal-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-rosegold-200/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-cream-200/10 to-transparent rounded-full blur-3xl" />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-6 h-6 bg-rosegold-300 rounded-full opacity-30"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-32 left-16 w-4 h-4 bg-cream-400 rounded-full opacity-40"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeInUp className="text-center mb-16">
          <motion.span
            className="inline-block text-primary-600 font-four dark:text-primary-400 font-bold text-lg mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Client Reviews
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-one text-charcoal-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            What Our Clients{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosegold-400 to-primary-400">
              Say
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 font-three dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Don't just take our word for it. Here's what our amazing clients
            have to say about their experience with LashUpAndMore.
          </motion.p>
        </FadeInUp>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="p-3 rounded-full hover:bg-rosegold-100 dark:hover:bg-charcoal-700"
            >
              <HiChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                    setTimeout(() => setIsAutoPlaying(true), 5000);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-rosegold-400 w-8"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-rosegold-200"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="p-3 rounded-full hover:bg-rosegold-100 dark:hover:bg-charcoal-700"
            >
              <HiChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.id}-${currentIndex}`}
                testimonial={testimonial}
                index={index}
                isActive={testimonial.isActive}
              />
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <FadeInUp className="text-center mt-16">
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 font-one"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-bold text-rosegold-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                98%
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-three">
                Client Satisfaction
              </p>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-300 dark:bg-gray-600" />

            <div className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-bold text-rosegold-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                4.9
              </motion.div>
              <div className="flex items-center justify-center space-x-1">
                <StarRating rating={5} />
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-300 dark:bg-gray-600" />

            <div className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-bold text-rosegold-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                500+
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-three">
                Happy Clients
              </p>
            </div>
          </motion.div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default TestimonialsSection;
