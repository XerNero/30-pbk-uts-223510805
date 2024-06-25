<template>
  <div class="container">
  <q-layout view="lHh Lpr lFf">
        <q-btn dense flat @click="leftDrawerOpen = !leftDrawerOpen" />
        <h1 class="slide-in">My Routine App</h1>
        <h3 class="slide-in1">Naufal Rizqullah</h3>
        <h3 class="slide-in2">223510805</h3>

        <q-list class="tab-header">
        <q-item :class="{ 'active': currentMenuType === 'todo' }" clickable @click="showTodoPage">
          <q-item-section>
            Todo List
          </q-item-section>
        </q-item>

        <q-item :class="{ 'active': currentMenuType === 'user' }" clickable @click="showUserPage">
          <q-item-section>
            Post
          </q-item-section>
        </q-item>

        <q-item :class="{ 'active': currentMenuType === 'album' }" clickable @click="showAlbumPage">
          <q-item-section>
            Album
          </q-item-section>
        </q-item>
      </q-list>

    <q-page-container>
      <Slot :menuType="currentMenuType" />
      <router-view :users="usersData" :photos="photosData"></router-view>
    </q-page-container>
  </q-layout>
</div>
</template>

<script>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import router from './routes/router';
import Slot from './components/Slot.vue';

export default {
  components: { Slot },
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false); 
    const usersData = ref([]);
    const photosData = ref([]);
    const currentMenuType = ref('');
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        usersData.value = await response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchPhotoData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        photosData.value = await response.json();
      } catch (error) {
        console.error('Error fetching photo data:', error);
      }
    };

    fetchUserData();
    fetchPhotoData();

    const showUserPage = () => {
      currentMenuType.value = 'user';
      router.push('/posts');
    };

    const showTodoPage = () => {
      currentMenuType.value = 'todo';
      router.push('/todos');
    };

    const showAlbumPage = () => {
      currentMenuType.value = 'album';
      router.push('/album');
    };

    watch(
      () => router.currentRoute.value.path,
      (newPath) => {
        if (newPath.includes('/posts')) {
          currentMenuType.value = 'user';
        } else if (newPath.includes('/todos')) {
          currentMenuType.value = 'todo';
        } else if (newPath.includes('/album')) {
          currentMenuType.value = 'album';
        } else {
          currentMenuType.value = '';
        }
      }
    );

    return {
      leftDrawerOpen,
      usersData,
      photosData, 
      currentMenuType,
      showUserPage,
      showTodoPage,
      showAlbumPage,
    };
  }
};
</script>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-image: url('https://c.wallhere.com/photos/20/4d/1920x1200_px_Dark_Floral_pattern_Vector_Art-572009.jpg!d');
  background-size: cover; /* Ukuran latar belakang menyesuaikan dengan area konten */
  background-position: center; /* Posisi latar belakang di tengah */
  background-repeat: no-repeat; /* Menghindari pengulangan latar belakang */
  background-attachment: fixed; /* Menetapkan latar belakang tetap saat gulir */
  border: 2px solid #ccc;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

ul{
  list-style-type: none;
}

.tab-header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

@keyframes tab-header {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-header button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tab-header button.active {
  background-color: #0056b3;
}

.slide-in {
  animation: slide-in 1s ease;
}

.slide-in1 {
  animation: slide-in 1.2s ease;
}

.slide-in2 {
  animation: slide-in 1.4s ease;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.q-item.active {
  background-color: #007bff; 
  color: #fff;
  border-radius: 10px;
  min-width: 120px; 
  padding: 8px 16px; 
}

</style>
