import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlay, HiPhotograph, HiVideoCamera } from 'react-icons/hi';
import { cn } from '@/utils/helpers';

const GalleryItem = ({ item, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isVideo = item.type === 'video';
  const isImage = item.type === 'image';

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div className="bg-gray-100 dark:bg-charcoal-700 rounded-lg p-8 text-center">
        <HiPhotograph className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Failed to load media</p>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-charcoal-700"
      onClick={handleClick}
    >
      {/* Loading Placeholder */}
      {!imageLoaded && (
        <div className="aspect-[3/4] flex items-center justify-center">
          <div className="animate-pulse w-8 h-8 bg-gray-300 dark:bg-charcoal-600 rounded-full"></div>
        </div>
      )}

      {/* Image */}
      {isImage && (
        <img
          src={item.url}
          alt="Gallery item"
          className={cn(
            "w-full h-auto object-cover transition-all duration-300 group-hover:scale-105",
            !imageLoaded && "hidden"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Video */}
      {isVideo && (
        <div className="relative">
          <video
            src={item.url}
            className={cn(
              "w-full h-auto object-cover transition-all duration-300 group-hover:scale-105",
              !imageLoaded && "hidden"
            )}
            onLoadedData={handleImageLoad}
            onError={handleImageError}
            muted
            preload="metadata"
          />
          
          {/* Video Play Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <HiPlay className="w-8 h-8 text-gray-900 ml-1" />
            </div>
          </div>
        </div>
      )}

      {/* Type Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
          {isVideo ? (
            <HiVideoCamera className="w-4 h-4 text-white" />
          ) : (
            <HiPhotograph className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.div>
  );
};

export default GalleryItem;

