import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiPhotograph,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { productsAPI } from "@/services/products";
import { uploadToCloudinary } from "@/services/cloudinary";
import { formatCurrency } from "@/utils/formatters";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
});

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      const uploadResult = await uploadToCloudinary(file, "products");
      setValue("imageUrl", uploadResult.url);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setImagePreview(null);
    reset({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setImagePreview(product.imageUrl);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (editingProduct) {
        // Update product
        await productsAPI.updateProduct(editingProduct.id, data);
        toast.success("Product updated successfully!");
      } else {
        // Create product
        await productsAPI.createProduct(data);
        toast.success("Product created successfully!");
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this product?</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id); // close the toast
                try {
                  await productsAPI.deleteProduct(productId);
                  toast.success("Product deleted successfully!");
                  fetchProducts();
                } catch (error) {
                  console.error("Delete error:", error);
                  toast.error("Failed to delete product");
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

  const toggleProductStatus = async (product) => {
    try {
      await productsAPI.updateProduct(product.id, {
        ...product,
        isActive: !product.isActive,
      });
      toast.success(
        `Product ${
          product.isActive ? "deactivated" : "activated"
        } successfully!`
      );
      fetchProducts();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update product status");
    }
  };

  if (loading && products.length === 0) {
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
            Product Management
          </h2>
          <p className="text-gray-600 font-three dark:text-gray-400">
            Manage your product catalog
          </p>
        </div>

        <Button className="font-three" onClick={openCreateModal}>
          <HiPlus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            layout
          >
            <Card className="p-0 overflow-hidden">
              {/* Product Image */}
              <div className="relative aspect-square">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => toggleProductStatus(product)}
                    className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    title={product.isActive ? "Deactivate" : "Activate"}
                  >
                    {product.isActive ? (
                      <HiEyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                      <HiEye className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-one text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 font-three dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-one text-primary-600 mb-4">
                  {formatCurrency(product.price)}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(product)}
                    className="flex-1 font-three text-lg"
                  >
                    <HiPencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-one text-gray-900 dark:text-white mb-3">
              Product Image
            </label>

            <div className="flex items-center space-x-4">
              {/* Image Preview */}
              <div className="w-32 h-32 bg-gray-100 dark:bg-charcoal-700 rounded-lg overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiPhotograph className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1 font-three">
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="cursor-pointer"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  {uploading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <HiPhotograph className="w-4 h-4 mr-2" />
                      Choose Image
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-1 font-three">
                  Max 5MB. JPG, PNG, WEBP supported.
                </p>
              </div>
            </div>

            {/* Hidden URL input */}
            <input type="hidden" {...register("imageUrl")} />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Product Name
            </label>
            <Input
              type="text"
              placeholder="Enter product name"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Enter product description"
              className="w-full px-4 py-3 border border-gray-300 dark:border-charcoal-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Price (₦)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price")}
              error={errors.price?.message}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || uploading}
              className="flex-1"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
