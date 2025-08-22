import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiArrowLeft } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import FadeInUp from '@/components/animations/FadeInUp';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-charcoal-900 dark:to-charcoal-800 flex items-center justify-center px-4 pt-16">
      <div className="max-w-2xl mx-auto text-center">
        <FadeInUp>
          {/* 404 Animation */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-9xl md:text-[12rem] font-one text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-burgundy-600 "
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: 'linear' 
              }}
              style={{ 
                backgroundSize: '200% 200%',
              }}
            >
              404
            </motion.h1>
          </motion.div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl  font-one text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <p className="text-lg font-three text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            It looks like the page you're looking for doesn't exist. 
            Perhaps you'd like to return home or browse our beautiful services?
          </p>
        </FadeInUp>

        <FadeInUp delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 font-three justify-center">
            <Link to="/">
              <Button size="lg" className="flex items-center space-x-2 px-8">
                <HiHome className="w-5 h-5" />
                <span>Back to Home</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-8"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </Button>
          </div>
        </FadeInUp>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-burgundy-400/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-tl from-rosegold-400/20 to-cream-400/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
        />
      </div>
    </div>
  );
};

export default NotFound;