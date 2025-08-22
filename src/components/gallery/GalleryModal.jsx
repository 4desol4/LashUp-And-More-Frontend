import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiChevronLeft, 
  HiChevronRight,
  HiDownload,
  HiShare,
  HiHeart
} from 'react-icons/hi';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const GalleryModal = ({ item, index, allItems, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [currentItem, setCurrentItem] = useState(item);

  useEffect(() => {
    setCurrentIndex(index);
    setCurrentItem(item);
  }, [index, item]);

  useEffect(() => {
    if (allItems && allItems[currentIndex]) {
      setCurrentItem(allItems[currentIndex]);
    }
  }, [currentIndex, allItems]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < allItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex, allItems.length]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentItem.url;
    link.download = `gallery-${currentItem.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LashUp And More Gallery',
          text: 'Check out this amazing work!',
          url: currentItem.url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentItem.url);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link');
      }
    }
  };

  if (!currentItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="p-0 bg-black/95"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Navigation Buttons */}
        {allItems.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all duration-200"
            >
              <HiChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex === allItems.length - 1}
              className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-all duration-200"
            >
              <HiChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
        >
          <HiX className="w-6 h-6 text-white" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <button
            onClick={handleDownload}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
            title="Download"
          >
            <HiDownload className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
            title="Share"
          >
            <HiShare className="w-5 h-5 text-white" />
          </button>
          <button
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
            title="Like"
          >
            <HiHeart className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Media Content */}
        <div className="max-w-full max-h-full p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {currentItem.type === 'video' ? (
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              ) : (
                <img
                  src={currentItem.url}
                  alt="Gallery item"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Counter */}
        {allItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} of {allItems.length}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GalleryModal;

