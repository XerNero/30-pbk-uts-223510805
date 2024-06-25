import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    users: [],
    searchQuery: ''
  }),
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

    // Load selected user and their posts from localStorage on component mount
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

    // Save selected user and their posts to localStorage
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
        saveToLocalStorage(); // Save to localStorage after fetching posts
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
        id: userPosts.value.length + 1 // Mock ID, since the real ID would come from the server
      };

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
        });

        const result = await response.json();
        userPosts.value.unshift(result); // Add the new post to the beginning of the array
        postTitle.value = '';
        postContent.value = '';

        saveToLocalStorage(); // Save to localStorage after posting new post
      } catch (error) {
        console.error('Error posting new post:', error);
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
      postSomething
    };
  }
});
