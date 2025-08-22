import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph, HiVideoCamera, HiFilter } from 'react-icons/hi';
import { galleryAPI } from '@/services/gallery';
import GalleryItem from './GalleryItem';
import GalleryModal from './GalleryModal';
import LoadingSpinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

const GalleryGrid = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All', icon: HiFilter },
    { id: 'image', label: 'Photos', icon: HiPhotograph },
    { id: 'video', label: 'Videos', icon: HiVideoCamera },
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, filter]);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getGalleryItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (filter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.type === filter));
    }
  };

  const handleItemClick = (item, index) => {
    setSelectedItem({ item, index, allItems: filteredItems });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filterOption) => {
          const Icon = filterOption.icon;
          const isActive = filter === filterOption.id;
          
          return (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={cn(
                'flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white dark:bg-charcoal-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-charcoal-600'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{filterOption.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items Count */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiPhotograph className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all' 
              ? 'No gallery items available yet.' 
              : `No ${filter}s found. Try selecting a different filter.`
            }
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid"
            >
              <GalleryItem
                item={item}
                onClick={() => handleItemClick(item, index)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Gallery Modal */}
      {selectedItem && (
        <GalleryModal
          item={selectedItem.item}
          index={selectedItem.index}
          allItems={selectedItem.allItems}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default GalleryGrid;

