import { defineStore } from 'pinia';

export const useAlbumStore = defineStore({
  id: 'album',
  state: () => ({
    albums: [],
    loading: false,
  }),
  actions: {
    async getAlbums(albumId) {
      this.loading = true;
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);
        const data = await response.json();
        this.albums = data;
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        this.loading = false;
      }
    },
    async uploadPhoto(formData) {
      try {
        // Replace the URL below with the actual endpoint for uploading photos
        const response = await fetch('https://your-upload-endpoint.com/upload', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Failed to upload photo');
        }
        const newPhoto = await response.json();
        this.albums.push(newPhoto); // Assuming the response contains the new photo details
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    },
  },
});
