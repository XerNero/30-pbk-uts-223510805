import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTodoStore = defineStore('todo', () => {
  const activities = ref([]);
  const filter = ref('semua');
  const tambahName = ref('');
  const editIndex = ref(null);
  const editName = ref('');

  const filteredActivities = computed(() => {
    if (filter.value === 'belum') {
      return activities.value.filter(kegiatan => !kegiatan.selesai);
    } else if (filter.value === 'selesai') {
      return activities.value.filter(kegiatan => kegiatan.selesai);
    } else {
      return activities.value;
    }
  });

  const totalKegiatan = computed(() => activities.value.length);
  const totalBelumSelesai = computed(() => activities.value.filter(kegiatan => !kegiatan.selesai).length);
  const totalSelesai = computed(() => activities.value.filter(kegiatan => kegiatan.selesai).length);

  const addActivity = (name) => {
    activities.value.push({ name, selesai: false });
  };

  const editkegiatan = (index) => {
    editIndex.value = index;
    editName.value = activities.value[index].name;
  };

  const updateActivityName = (index, name) => {
    activities.value[index].name = name;
    editIndex.value = null;
    editName.value = '';
  };

  const batalEdit = () => {
    editIndex.value = null;
    editName.value = '';
  };

  const deleteActivity = (index) => {
    activities.value.splice(index, 1);
  };

  const setFilter = (newFilter) => {
    filter.value = newFilter;
  };

  const updateActivityStatus = (activity) => {
  };

  return {
    activities,
    filter,
    tambahName,
    editIndex,
    editName,
    filteredActivities,
    totalKegiatan,
    totalBelumSelesai,
    totalSelesai,
    addActivity,
    editkegiatan,
    updateActivityName,
    batalEdit,
    deleteActivity,
    setFilter,
    updateActivityStatus
  };
});
