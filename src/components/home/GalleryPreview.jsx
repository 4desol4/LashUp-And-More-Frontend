import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiPhotograph } from "react-icons/hi";
import FadeInUp from "@/components/animations/FadeInUp";
import Button from "@/components/ui/Button";
import { galleryAPI } from "@/services/gallery";
import GalleryItem from "@/components/gallery/GalleryItem";
import GalleryModal from "@/components/gallery/GalleryModal";

const GalleryPreview = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let interval;

    const fetchGalleryItems = async () => {
      try {
        const response = await galleryAPI.getGalleryItems();
        setItems(response?.data?.slice(0, 6) ?? []);
        setError(null);
        clearInterval(interval); // stop retry if success
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError("Server unavailable, retrying...");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
    interval = setInterval(fetchGalleryItems, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleItemClick = (item, index) => {
    setSelectedItem({ item, index, allItems: items });
  };

  const closeModal = () => setSelectedItem(null);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-charcoal-800/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-charcoal-700 rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-charcoal-800/50 relative overflow-hidden">
      {/* Background Gradient Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-200/20 to-burgundy-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-rosegold-200/20 to-cream-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeInUp className="text-center mb-16">
          <motion.span
            className="inline-block font-four text-primary-600 dark:text-primary-400 font-bold text-xl mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Work
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-one text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Gallery Showcase
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 font-three font-semibold dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover the artistry and precision that goes into every lash
            treatment. See real transformations and the beautiful results we
            create for our clients.
          </motion.p>
        </FadeInUp>

        {error && items.length === 0 ? (
          <div className="text-center py-12">
            <HiPhotograph className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-three">
              {error}
            </p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {items.map((item, index) => (
                <div key={item.id} className="mb-6 break-inside-avoid">
                  <GalleryItem
                    item={item}
                    onClick={() => handleItemClick(item, index)}
                  />
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <FadeInUp className="text-center mt-16" delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center font-three">
                <Link to="/gallery">
                  <Button size="lg" className="px-8">
                    View Full Gallery
                  </Button>
                </Link>
              </div>
            </FadeInUp>
          </>
        )}
      </div>

      {/* Gallery Modal */}
      {selectedItem && (
        <GalleryModal
          item={selectedItem.item}
          index={selectedItem.index}
          allItems={selectedItem.allItems}
          isOpen={!!selectedItem}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default GalleryPreview;
