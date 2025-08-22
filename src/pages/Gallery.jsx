import { motion } from "framer-motion";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { ANIMATION_VARIANTS } from "@/utils/constants";
import BackToTop from "@/components/ui/BackToTop";
const Gallery = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white dark:from-charcoal-900 dark:to-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={ANIMATION_VARIANTS.fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-one text-gray-900 dark:text-white mb-6">
              Our <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl font-three text-gray-600 dark:text-gray-400 leading-relaxed">
              Discover the artistry of our lash work. Each design is carefully
              crafted to enhance your natural beauty and create stunning
              results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto font-three px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>
      <BackToTop />
    </div>
  );
};

export default Gallery;
