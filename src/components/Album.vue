<template>
  <div class="album-page">
    <form @submit.prevent="navigateToAlbum" class="form">
      <div class="search-options">
        <!-- Optional: Search type selector can go here -->
      </div>
      <div v-if="searchType === 'albumId'">
        <label for="albumId">AlbumID:</label>
        <input type="number" v-model.number="searchValue" id="albumId" required class="input">
      </div>
      <button type="submit" class="button">Tampilkan Album</button>
    </form>

    <div v-if="loading" class="loading-container">
      <q-spinner color="grey" size="50px" />
    </div>

    <div v-if="albums.length > 0 && !loading">
      <h2>Album Details</h2>

      <div class="search-albums">
        <label for="searchAlbums">Cari Album:</label>
        <input type="text" v-model="searchQuery" id="searchAlbums" placeholder="Cari berdasarkan judul" class="input">
      </div>

      <div class="cards-container">
        <q-card v-for="album in filteredAlbums" :key="album.id" class="my-card">
          <img :src="album.thumbnailUrl" alt="Thumbnail">
          
          <q-card-section>
            <div class="text-h6">{{ album.title }}</div>
            <div class="text-subtitle2">{{ album.albumId }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <a :href="album.url" class="url">{{ album.url }}</a>
          </q-card-section>
        </q-card>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    photos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchType: 'albumId', 
      searchValue: null,
      albums: [],
      searchQuery: '',
      loading: false
    };
  },
  computed: {
    filteredAlbums() {
      return this.albums.filter(album =>
        album.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    navigateToAlbum() {
      if (this.searchType === 'albumId') {
        this.$router.push(`/albums/${this.searchValue}`);
        this.saveStateToLocalStorage(); 
      }
    },
    async getAlbums() {
      this.loading = true; 
      this.selectByAlbumId();
      this.loading = false; 
      this.saveStateToLocalStorage(); 
    },
    selectByAlbumId() {
      this.albums = this.photos.filter(photo => photo.albumId === parseInt(this.searchValue));
    },
    saveStateToLocalStorage() {
      localStorage.setItem('albumPageState', JSON.stringify({
        searchType: this.searchType,
        searchValue: this.searchValue,
        albums: this.albums,
        searchQuery: this.searchQuery
      }));
    },
    loadStateFromLocalStorage() {
      const savedState = localStorage.getItem('albumPageState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.searchType = state.searchType;
        this.searchValue = state.searchValue;
        this.albums = state.albums;
        this.searchQuery = state.searchQuery;
      }
    }
  },
  mounted() {
    this.loadStateFromLocalStorage();
  }
};
</script>

<style scoped>

.q-card img {
  max-width: 100%;
  height: auto;
}

.q-card-section {
  padding: 16px;
}

h2 {
  font-size: 24px;
}
.album-page {
  padding: 20px;
}


.search-options {
  margin-bottom: 10px;
}

.search-albums {
  margin-bottom: 20px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 1600px; 
  overflow-y: auto; 
}

.q-pa-md {
  padding: 16px;
}

.q-gutter-md {
  gap: 16px;
}

.my-card {
  width: 250px; 
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px;
  background-color: rgba(255, 253, 253, 0.582);
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-subtitle2 {
  font-size: 1rem;
  color: #666;
}

.q-pt-none {
  padding-top: 0;
}

.url {
  display: block;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal; 
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.button {
  padding: 10px 20px;
  background-color: #007ef3;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0072dc;
}

.form {
  margin-bottom: 20px;
}

.input {
  padding: 8px;
  margin-bottom: 10px;
}

</style>
