<template>
  <q-page padding>
    <div class="post-container">
      <p>{{ propertiContoh }}</p>

      <div class="q-layout-gt-xs-row q-mb-md">
        <div class="q-col">
          <div class="input-tambah-kegiatan">
            <q-input v-model="tambahName" label="Masukkan Kegiatan" dense outlined></q-input>
          </div>
        </div>
      </div>
      <div class="q-col-auto">
        <q-btn @click="buttonEnter" label="Tambahkan Kegiatan" color="primary" full-width></q-btn>
      </div>

      <div class="filter-dropdown q-mt-lg">
        <q-btn-dropdown label="Filter Kegiatan" color="primary">
          <q-list>
            <q-item clickable v-ripple class="konten" @click="setFilter('semua')">
              <q-item-section>List Semua Kegiatan</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="konten" @click="setFilter('belum')">
              <q-item-section>List Kegiatan Belum Selesai</q-item-section>
            </q-item>
            <q-item clickable v-ripple class="konten" @click="setFilter('selesai')">
              <q-item-section>List Kegiatan Selesai</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <div class="task-counts q-mt-md">
        <p>Total Kegiatan: {{ totalKegiatan }}</p>
        <p>Kegiatan Belum Selesai: {{ totalBelumSelesai }}</p>
        <p>Kegiatan Selesai: {{ totalSelesai }}</p>
      </div>

      <q-table :rows="filteredActivities" :columns="columns" row-key="name" flat class="tabel">
        <template v-slot:body-cell-index="props">
          <q-td :props="props">{{ props.rowIndex + 1 }}</q-td>
        </template>

        <template v-slot:body-cell-selesai="props">
          <q-td :props="props">
            <q-btn
              class="status-button"
              color="primary"
              @click="toggleStatus(props.row)"
              :label="props.row.selesai ? 'SELESAI' : 'BELUM selesai'"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <template v-if="props.rowIndex !== editIndex">
              <span :class="{ selesai: props.row.selesai }">{{ props.row.name }}</span>
            </template>
            <template v-else>
              <q-input v-model="editName" @keyup.enter="simpanedit(props.rowIndex)" @keyup.esc="batalEdit" outlined></q-input>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <template v-if="props.rowIndex !== editIndex">
              <q-btn flat label="Edit" class="edit-button" @click="editkegiatan(props.rowIndex)"></q-btn>
            </template>
            <template v-else>
              <q-btn flat label="Save" @click="simpanedit(props.rowIndex)"></q-btn>
              <q-btn flat label="Cancel" @click="batalEdit"></q-btn>
            </template>
            <q-btn flat label="Delete" class="delete-button" @click="cancelkegiatan(props.rowIndex)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { useTodoStore } from '../stores/todoStore';
import { computed, ref, onMounted } from 'vue';

export default {
  props: ['propertiContoh'],
  setup(props) {
    const store = useTodoStore();

    const tambahName = ref('');
    const editIndex = ref(null);
    const editName = ref('');

    const saveToLocalStorage = () => {
      localStorage.setItem('todoAppData', JSON.stringify(store.activities));
    };

    const loadFromLocalStorage = () => {
      const savedData = localStorage.getItem('todoAppData');
      if (savedData) {
        store.activities = JSON.parse(savedData);
      }
    };

    onMounted(loadFromLocalStorage);

    const buttonEnter = () => {
      if (tambahName.value.trim() !== '') {
        store.addActivity(tambahName.value);
        tambahName.value = '';
        saveToLocalStorage(); 
      }
    };

    const toggleStatus = (activity) => {
      activity.selesai = !activity.selesai;
      saveToLocalStorage(); 
    };

    const editkegiatan = (index) => {
      editIndex.value = index;
      editName.value = store.activities[index].name;
    };

    const simpanedit = (index) => {
      if (editName.value.trim() !== '') {
        store.updateActivityName(index, editName.value);
        editIndex.value = null;
        editName.value = '';
        saveToLocalStorage(); 
      }
    };

    const batalEdit = () => {
      editIndex.value = null;
      editName.value = '';
    };

    const cancelkegiatan = (index) => {
      store.deleteActivity(index);
      if (index === editIndex.value) {
        batalEdit();
      }
      saveToLocalStorage(); 
    };

    const setFilter = (newFilter) => {
      store.setFilter(newFilter);
    };

    return {
      propertiContoh: props.propertiContoh,
      tambahName,
      editIndex,
      editName,
      columns: [
        { name: 'selesai', label: 'Status', align: 'center' },
        { name: 'name', label: 'List Kegiatan', align: 'left' },
        { name: 'actions', label: '', align: 'right' }
      ],
      filteredActivities: computed(() => store.filteredActivities),
      buttonEnter,
      editkegiatan,
      simpanedit,
      batalEdit,
      cancelkegiatan,
      setFilter,
      toggleStatus,
      totalKegiatan: computed(() => store.totalKegiatan),
      totalBelumSelesai: computed(() => store.totalBelumSelesai),
      totalSelesai: computed(() => store.totalSelesai)
    };
  }
};
</script>

<style scoped>
.konten {
  color: black;
}

.tabel {
  background-color: #fff;
}

.selesai {
  text-decoration: line-through;
}

.status-button {
  width: 150px; 
  display: flex;
  justify-content: center;
}

.edit-button {
  background-color: green;
  color: white;
  margin-right: 10px; 
}

.delete-button {
  background-color: red;
  color: white;
  margin-left: 10px; 
}

.input-tambah-kegiatan {
  background-color: #fff;
  border-radius: 8px;
}
</style>
