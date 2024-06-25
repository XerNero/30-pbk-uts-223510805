<template>
  <div class="user-page">
    <form @submit.prevent="getUserPosts" class="form">
      <div class="search-options">
      </div>
      <div v-if="searchType === 'name'">
        <label for="userName">Nama User:</label>
        <select v-model="searchValue" id="userName" required class="input">
          <option v-for="user in users" :value="user.name" :key="user.id">{{ user.name }}</option>
        </select>
      </div>
      <button type="submit" class="button">Tampilkan Postingan</button>
    </form>

    <form @submit.prevent="postSomething" class="form">
      <div>
        <label for="postTitle">Title:</label>
        <input type="text" v-model="postTitle" id="postTitle" required class="input">
      </div>
      <div>
        <label for="postContent">Content:</label>
        <textarea v-model="postContent" id="postContent" required class="input"></textarea>
      </div>
      <button type="submit" class="button">Post Something</button>
    </form>

    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-if="selectedUserId && userPosts.length > 0 && !loading" class="post-container">
      <div class="post-list">

        <q-card-section v-for="post in userPosts" :key="post.id" class="post-card">
          <q-card class="my-card">
            <q-card-section style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);">
              <h3>{{ post.title }}</h3>
              <p>{{ post.body }}</p>
            </q-card-section>

            <q-card-actions  class="delete-center">
              <q-btn @click="deletePost(post.id)" color="negative" label="Delete" />
            </q-card-actions>
          </q-card>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';

export default defineComponent({
  props: {
    users: {
      type: Array,
      required: true
    }
  },

  setup(props) {
    const userStore = useUserStore();
    const searchType = ref('name');
    const searchValue = ref('');
    const userPosts = ref([]);
    const selectedUserId = ref(null);
    const selectedUserName = ref('');
    const loading = ref(false);
    const postTitle = ref('');
    const postContent = ref('');


    onMounted(() => {
      const storedUserId = localStorage.getItem('selectedUserId');
      const storedUserName = localStorage.getItem('selectedUserName');
      const storedUserPosts = JSON.parse(localStorage.getItem('userPosts'));

      if (storedUserId && storedUserName && storedUserPosts) {
        selectedUserId.value = parseInt(storedUserId);
        selectedUserName.value = storedUserName;
        userPosts.value = storedUserPosts;
      }
    });

    const saveToLocalStorage = () => {
      localStorage.setItem('selectedUserId', selectedUserId.value);
      localStorage.setItem('selectedUserName', selectedUserName.value);
      localStorage.setItem('userPosts', JSON.stringify(userPosts.value));
    };


    const fetchUserPosts = async (userId) => {
      loading.value = true;
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        userPosts.value = await response.json();
        saveToLocalStorage();
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        loading.value = false;
      }
    };


    const selectUserByName = () => {
      const selectedUser = props.users.find(user => user.name.toLowerCase() === searchValue.value.toLowerCase());
      if (selectedUser) {
        selectedUserId.value = selectedUser.id;
        selectedUserName.value = selectedUser.name;
        fetchUserPosts(selectedUser.id);
      } else {
        console.error('User not found');
      }
    };


    const getUserPosts = () => {
      if (searchType.value === 'name') {
        selectUserByName();
      }
    };

    const postSomething = async () => {
      if (!selectedUserId.value) {
        console.error('No user selected');
        return;
      }

      const newPost = {
        userId: selectedUserId.value,
        title: postTitle.value,
        body: postContent.value,
        id: userPosts.value.length + 1 
      };

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
        });

        if (response.ok) {
          const result = await response.json();
          userPosts.value.unshift(result); 
          postTitle.value = '';
          postContent.value = '';

          saveToLocalStorage(); 
        } else {
          console.error('Failed to post new post');
        }
      } catch (error) {
        console.error('Error posting new post:', error);
      }
    };

    const deletePost = async (postId) => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          userPosts.value = userPosts.value.filter(post => post.id !== postId);
          saveToLocalStorage(); 
        } else {
          console.error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    };

    return {
      searchType,
      searchValue,
      userPosts,
      selectedUserId,
      selectedUserName,
      loading,
      postTitle,
      postContent,
      getUserPosts,
      postSomething,
      deletePost
    };
  }
});
</script>


<style scoped>
.user-page {
  padding: 20px;
}

.post-container {
  display: flex;
  justify-content: center;
}


.post-card {
  margin: 10px 0;
  width: 100%;
}



.input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #00bd4f;
}

.button {
  padding: 12px 24px;
  background-color: #007ef3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.post-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  border-radius: 10px; 
}


.button:hover {
  background-color: #0072dc;
}

.search-options {
  margin-bottom: 20px;
}

.card {
  padding: 20px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}

.card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.25em;
}

.card p {
  color: #666;
}

h2 {
  font-size: 1.5em;
}

.my-card {
  border-radius: 10px;
  background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
}

.text-h6 {
  font-size: 1.25rem;
}

.input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.post-card {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.326);
}

.post-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 24px;
}

.post-card p {
  margin-top: 0;
  color: white;
}

.delete-center {
  display: flex;
  justify-content: center;
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.form {
  margin-bottom: 20px;
}
</style>
