import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiTrash,
  HiPhotograph,
  HiVideoCamera,
  HiUpload,
  HiX,
} from "react-icons/hi";
import { galleryAPI } from "@/services/gallery";
import { uploadToCloudinary } from "@/services/cloudinary";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/Spinner";
import { cn } from "@/utils/helpers";
import toast from "react-hot-toast";

const GalleryManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all", label: "All", icon: HiPhotograph },
    { id: "image", label: "Images", icon: HiPhotograph },
    { id: "video", label: "Videos", icon: HiVideoCamera },
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getGalleryItems();
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);

    // Validate files
    const validFiles = files.filter((file) => {
      const isValid =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isUnderLimit = file.size <= 50 * 1024 * 1024; // 50MB limit

      if (!isValid) {
        toast.error(`${file.name} is not a valid image or video file`);
        return false;
      }

      if (!isUnderLimit) {
        toast.error(`${file.name} is too large. Max size is 50MB`);
        return false;
      }

      return true;
    });

    // Create file objects with preview
    const fileObjects = validFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "video",
      size: file.size,
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...fileObjects]);
  }, []);

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = selectedFiles.map(async (fileObj) => {
      try {
        setUploadProgress((prev) => ({ ...prev, [fileObj.id]: 0 }));

        const folder =
          fileObj.type === "image" ? "gallery/images" : "gallery/videos";
        const uploadResult = await uploadToCloudinary(fileObj.file, folder);

        setUploadProgress((prev) => ({ ...prev, [fileObj.id]: 100 }));

        // Add to gallery via API
        await galleryAPI.addGalleryItem({
          type: fileObj.type,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        });

        return uploadResult;
      } catch (error) {
        console.error(`Upload failed for ${fileObj.name}:`, error);
        toast.error(`Failed to upload ${fileObj.name}`);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(`Successfully uploaded ${selectedFiles.length} file(s)!`);

      // Clean up
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      setSelectedFiles([]);
      setUploadProgress({});
      setShowUploadModal(false);
      fetchGalleryItems();
    } catch (error) {
      toast.error("Some uploads failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (itemId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this item?</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await galleryAPI.deleteGalleryItem(itemId);
                  setItems((prev) => prev.filter((item) => item.id !== itemId));
                  toast.success("Item deleted successfully!");
                } catch (error) {
                  console.error("Delete error:", error);
                  toast.error("Failed to delete item");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 border rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  };

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-one text-gray-900 dark:text-white">
            Gallery Management
          </h2>
          <p className="text-gray-600 font-three dark:text-gray-400">
            Upload and manage gallery images and videos
          </p>
        </div>

        <Button className="font-three" onClick={() => setShowUploadModal(true)}>
          <HiPlus className="w-5 h-5 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 font-three">
        {filters.map((filterOption) => {
          const Icon = filterOption.icon;
          const isActive = filter === filterOption.id;

          return (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-charcoal-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{filterOption.label}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {filter === "all"
                  ? items.length
                  : items.filter((item) => item.type === filterOption.id)
                      .length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-charcoal-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiPhotograph className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-one text-gray-900 dark:text-white mb-2">
            No {filter === "all" ? "items" : filter + "s"} found
          </h3>
          <p className="text-gray-600 font-three dark:text-gray-400 mb-6">
            Upload your first {filter === "all" ? "media files" : filter} to get
            started.
          </p>
          <Button
            className="font-three"
            onClick={() => setShowUploadModal(true)}
          >
            <HiUpload className="w-5 h-5 mr-2" />
            Upload Media
          </Button>
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
              <Card className="p-0 overflow-hidden group">
                {/* Media Content */}
                <div className="relative">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt="Gallery item"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-auto object-cover"
                      muted
                      loop
                      playsInline
                    />
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(item.url, "_blank")}
                        className="bg-white/90 hover:bg-white border-white text-gray-900"
                      >
                        <HiPhotograph className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <HiTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={cn(
                        "inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                        item.type === "image"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      )}
                    >
                      {item.type === "image" ? (
                        <HiPhotograph className="w-3 h-3" />
                      ) : (
                        <HiVideoCamera className="w-3 h-3" />
                      )}
                      <span>{item.type}</span>
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          if (!uploading) {
            setShowUploadModal(false);
            setSelectedFiles([]);
            setUploadProgress({});
          }
        }}
        title="Upload Media Files"
        size="lg"
        className="font-one font-normal "
      >
        <div className="space-y-6">
          {/* File Drop Zone */}
          <div className="border-2 border-dashed border-gray-300 dark:border-charcoal-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <HiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium font-three text-gray-900 dark:text-white mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-gray-600 font-three dark:text-gray-400">
                Support for images and videos up to 50MB each
              </p>
            </label>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium font-three text-gray-900 dark:text-white">
                Selected Files ({selectedFiles.length})
              </h4>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {selectedFiles.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-charcoal-700 rounded-lg"
                  >
                    {/* Preview */}
                    <div className="w-12 h-12 bg-gray-200 dark:bg-charcoal-600 rounded-lg overflow-hidden flex-shrink-0">
                      {fileObj.type === "image" ? (
                        <img
                          src={fileObj.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiVideoCamera className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-one text-gray-900 dark:text-white truncate">
                        {fileObj.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-three">
                        {formatFileSize(fileObj.size)} • {fileObj.type}
                      </p>

                      {/* Upload Progress */}
                      {uploadProgress[fileObj.id] !== undefined && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-charcoal-600 rounded-full h-1">
                              <div
                                className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                                style={{
                                  width: `${uploadProgress[fileObj.id]}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {uploadProgress[fileObj.id]}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {!uploading && (
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-charcoal-700">
            <Button
              variant="outline"
              onClick={() => {
                if (!uploading) {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                  setUploadProgress({});
                }
              }}
              disabled={uploading}
              className="flex-1 font-three"
            >
              Cancel
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={selectedFiles.length === 0 || uploading}
              loading={uploading}
              className="flex-1 font-three"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} File(s)`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryManagement;
