export const uploadToCloudinary = async (file, folder = 'sewa-lashes') => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      type: data.resource_type, // 'image' or 'video'
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

  // Note: This should be done on the backend for security
  // This is just for demonstration
  console.warn('Delete operation should be performed on backend');
  return Promise.resolve();
};