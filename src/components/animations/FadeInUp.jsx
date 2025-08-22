import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_VARIANTS, TRANSITIONS } from '@/utils/constants';

const FadeInUp = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = '',
  once = true,
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      whileInView="animate"
      exit="exit"
      viewport={{ once, margin: "-100px" }}
      variants={ANIMATION_VARIANTS.fadeInUp}
      transition={{ 
        ...TRANSITIONS.default, 
        duration, 
        delay 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;