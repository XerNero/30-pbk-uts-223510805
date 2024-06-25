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
  },
});
