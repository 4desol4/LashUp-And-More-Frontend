import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import SnowfallEffect from '@/components/animations/SnowfallEffect';
import FadeInUp from '@/components/animations/FadeInUp';
import { PLACEHOLDER_IMAGES } from '@/utils/constants';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src={PLACEHOLDER_IMAGES.hero}
            alt="Beautiful woman with perfect eyelashes"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Content */}
          <div className="text-white space-y-5">
            <FadeInUp delay={0.2}>
              <motion.p 
                className="text-lg md:text-2xl font-medium font-four tracking-wide text-rosegold-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Change Yourself
              </motion.p>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-one leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Perfect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosegold-300 to-cream-300">
                  Eyelashes
                </span>
              </motion.h1>
            </FadeInUp>

            <FadeInUp delay={0.6}>
              <motion.p 
                className="text-lg md:text-xl font-three leading-relaxed text-gray-200 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                The masters of our studio are certified and have significant experience, 
                which ensures high-quality performance of our services.
              </motion.p>
            </FadeInUp>

            <FadeInUp delay={0.8}>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 font-one"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Link to="/services">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-rosegold-400 to-cream-400 text-charcoal-900 hover:from-rosegold-500 hover:to-cream-500 font-semibold px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Book Now
                  </Button>
                </Link>
                
                <Link to="/gallery">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-charcoal-900 px-8 py-4 backdrop-blur-sm bg-white/10"
                  >
                    View Gallery
                  </Button>
                </Link>
              </motion.div>
            </FadeInUp>

            {/* Stats */}
            <FadeInUp delay={1.0}>
              <motion.div 
                className="flex flex-wrap gap-8 pt-8 font-one"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="text-3xl md:text-4xl  text-rosegold-300 "
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    500+
                  </motion.div>
                  <p className="text-sm text-gray-300 mt-1">Happy Clients</p>
                </div>
                
                <div className="text-center">
                  <motion.div 
                    className="text-3xl md:text-4xl  text-rosegold-300 "
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                  >
                    3+
                  </motion.div>
                  <p className="text-sm text-gray-300 mt-1">Years Experience</p>
                </div>
                
                <div className="text-center">
                  <motion.div 
                    className="text-3xl md:text-4xl  text-rosegold-300 "
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                  >
                    15+
                  </motion.div>
                  <p className="text-sm text-gray-300 mt-1">Services</p>
                </div>
              </motion.div>
            </FadeInUp>
          </div>

          {/* Right Content - Floating Elements */}
          <div className="relative hidden lg:block">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6, 
                ease: "easeInOut" 
              }}
              className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-rosegold-400 to-cream-400 rounded-full opacity-80 blur-xl"
            />
            
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 8, 
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-20 right-32 w-16 h-16 bg-gradient-to-br from-primary-400 to-burgundy-400 rounded-full opacity-60 blur-lg"
            />
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-cream-300 to-rosegold-300 rounded-full opacity-40 blur-2xl"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;