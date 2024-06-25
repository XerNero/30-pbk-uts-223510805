<template>
    <div class="slot-container">
      <h2 v-if="menuType === 'user'">Menu User</h2>
      <h2 v-else-if="menuType === 'todo'">Menu Kegiatan</h2>
      <h2 v-else-if="menuType === 'album'">Menu Album</h2>

    </div>
  </template>
  
  <script>
  export default {
    name: 'Slot',
    props: {
      menuType: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
.slot-container {
  background-color: rgb(248, 248, 248);
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
}

.slot-container h2 {
  font-size: 20px;
  margin-bottom: 0.1px;
}
  </style>