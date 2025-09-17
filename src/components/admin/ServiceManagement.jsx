import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiPhotograph,
  HiClock,
  HiCurrencyDollar,
  HiX,
} from "react-icons/hi";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useServices } from "@/hooks/useServices";
import { uploadToCloudinary } from "@/services/cloudinary";
import { formatCurrency } from "@/utils/formatters";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";

const serviceSchema = yup.object().shape({
  name: yup.string().required("Service name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
  duration: yup
    .number()
    .positive("Duration must be positive")
    .required("Duration is required"),
  features: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.string().required("Feature is required"),
      })
    )
    .min(1, "At least one feature is required"),
});

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      features: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const {
    services: servicesData,
    loading: servicesLoading,
    createService,
    updateService,
    deleteService,
  } = useServices(true);

  useEffect(() => {
    setServices(servicesData);
    setLoading(servicesLoading);
  }, [servicesData, servicesLoading]);

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

      const uploadResult = await uploadToCloudinary(file, "services");
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
    setEditingService(null);
    setImagePreview(null);
    reset({
      name: "",
      description: "",
      price: "",
      duration: "",
      imageUrl: "",
      features: [{ value: "" }],
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setImagePreview(service.imageUrl);
    reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      imageUrl: service.imageUrl,
      features: service.features.map((feature) => ({ value: feature })),
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const serviceData = {
        ...data,
        features: data.features
          .map((f) => f.value)
          .filter((f) => f.trim() !== ""),
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this service?</p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteService(serviceId);
                } catch (error) {
                  console.error("Delete error:", error);
                  toast.error("Failed to delete service");
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

  if (loading && services.length === 0) {
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
            Service Management
          </h2>
          <p className="text-gray-600 font-three dark:text-gray-400">
            Manage your bookable services
          </p>
        </div>

        <Button className="font-three" onClick={openCreateModal}>
          <HiPlus className="w-5 h-5 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            layout
          >
            <Card className="p-0 overflow-hidden">
              {/* Service Image */}
              <div className="relative aspect-video">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Info */}
              <div className="p-4">
                <h3 className="font-one text-gray-900 dark:text-white mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 font-three dark:text-gray-400 mb-3 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-one text-primary-600">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <HiClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-three text-gray-500">
                      {service.duration}h
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-50 dark:bg-charcoal-700 text-gray-500 rounded-full">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(service)}
                    className="flex-1 font-three text-lg"
                  >
                    <HiPencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(service.id)}
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

      {/* Service Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-one text-gray-900 dark:text-white mb-3">
              Service Image
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

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Service Name
            </label>
            <Input
              type="text"
              placeholder="Enter service name"
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
              placeholder="Enter service description"
              className="w-full px-4 py-3 border border-gray-300 dark:border-charcoal-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Duration (hours)
              </label>
              <Input
                type="number"
                step="0.5"
                min="0"
                placeholder="2.0"
                {...register("duration")}
                error={errors.duration?.message}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Service Features
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    {...register(`features.${index}.value`)}
                    placeholder={`Feature ${index + 1}`}
                    error={errors.features?.[index]?.value?.message}
                    className="flex-1"
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:bg-red-50 p-2"
                    >
                      <HiX className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
                className="w-full"
              >
                <HiPlus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            {errors.features && (
              <p className="mt-1 text-sm text-red-600">
                {errors.features.message}
              </p>
            )}
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
              {editingService ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
