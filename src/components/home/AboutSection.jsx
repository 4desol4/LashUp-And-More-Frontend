import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiCheckCircle, HiHeart, HiSparkles, HiStar } from 'react-icons/hi';
import FadeInUp from '@/components/animations/FadeInUp';
import Button from '@/components/ui/Button';
import { PLACEHOLDER_IMAGES } from '@/utils/constants';

const AboutSection = () => {
  const features = [
    {
      icon: HiCheckCircle,
      title: 'Always Beautiful Eyes',
      description: 'Create natural extensions to achieve beauty that makes every woman uniquely beautiful.',
    },
    {
      icon: HiHeart,
      title: 'No More Makeup',
      description: 'With selected eyelashes you can have perfect look for everyday.',
    },
    {
      icon: HiSparkles,
      title: 'Hypoallergenic',
      description: 'We are without any risk wondering, and you feel more aesthetically beautiful.',
    },
    {
      icon: HiStar,
      title: 'You Can Swim in the Sea',
      description: 'We are distinguished by our individual approach to each client.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Clients', description: 'Satisfied customers' },
    { number: '3+', label: 'Years Experience', description: 'In the beauty industry' },
    { number: '15+', label: 'Services', description: 'Professional treatments' },
    { number: '99%', label: 'Satisfaction', description: 'Client satisfaction rate' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-charcoal-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-primary-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gradient-to-l from-rosegold-200/30 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <FadeInUp>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block font-four font-bold text-xl text-primary-600 dark:text-primary-400   mb-4 tracking-wide">
                  About Studio
                </span>
                
                <h2 className="text-4xl md:text-5xl font-one  text-gray-900 dark:text-white mb-6  leading-tight">
                  Eye
                  <span className="relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-burgundy-600">
                      lashes
                    </span>
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-burgundy-600 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </span>
                </h2>
                
                <p className="text-lg text-gray-600 font-three font-semibold dark:text-gray-400 leading-relaxed mb-8">
                  Eye & Lash Center for creating a beautiful image. We make every 
                  woman uniquely beautiful. We have a team of professional 
                  masters who work on the highest quality materials and use the 
                  standard of the technique of beauty.
                </p>
              </motion.div>
            </FadeInUp>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FadeInUp key={feature.title} delay={index * 0.1}>
                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-charcoal-800 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-burgundy-600 rounded-full flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg  font-one text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 font-three font-medium dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </FadeInUp>
              ))}
            </div>

            {/* CTA Button */}
            <FadeInUp delay={0.6}>
              <Link to="/about">
                <Button size="lg" className="px-8 font-three">
                  Read More
                </Button>
              </Link>
            </FadeInUp>
          </div>

          {/* Right Content - Image and Stats */}
          <div className="relative">
            <FadeInUp delay={0.3}>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <motion.img
                    src={PLACEHOLDER_IMAGES.hero}
                    alt="Professional eyelash extension service"
                    className="w-full h-96 md:h-[500px] object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Floating Badge */}
                  <motion.div
                    className="absolute top-6 right-6 bg-white dark:bg-charcoal-800 rounded-xl p-4 shadow-lg backdrop-blur-sm"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    <div className="text-center">
                      <div className="text-2xl  text-primary-600 dark:text-primary-400 font-one">
                        3+
                      </div>
                      <div className="text-xs font-three text-gray-600 dark:text-gray-400">
                        Years Experience
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-rosegold-400 to-cream-400 rounded-full opacity-80 blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 0.5, 0.8]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                />
                
                <motion.div
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-primary-400 to-burgundy-400 rounded-full opacity-60 blur-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.3, 0.6]
                  }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                />
              </motion.div>
            </FadeInUp>

            {/* Stats Cards */}
            <FadeInUp delay={0.8}>
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white dark:bg-charcoal-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-charcoal-700 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <motion.div
                        className="text-2xl  text-primary-600 dark:text-primary-400 font-one"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 3, 
                          ease: 'easeInOut',
                          delay: index * 0.5 
                        }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-xs font-three text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeInUp>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <FadeInUp delay={1.0}>
          <motion.div
            className="mt-20 bg-gradient-to-r from-primary-50 to-burgundy-50 dark:from-charcoal-800 dark:to-charcoal-700 rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className="text-3xl md:text-4xl  text-primary-600 dark:text-primary-400 font-one mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4, 
                      ease: 'easeInOut',
                      delay: index * 0.5 
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-lg font-semibold font-three text-gray-900 dark:text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600 font-three dark:text-gray-400">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeInUp>
      </div>
    </section>
  );
};

export default AboutSection;