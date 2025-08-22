import api from './api';

export const galleryAPI = {
 
  getGalleryItems: () => {
    return api.get('/gallery');
  },


  addGalleryItem: (itemData) => {
    return api.post('/gallery', itemData);
  },


  deleteGalleryItem: (itemId) => {
    return api.delete(`/gallery/${itemId}`);
  },


  getGalleryItemsByType: (type) => {
    return api.get('/gallery', {
      params: { type }
    });
  },


  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};