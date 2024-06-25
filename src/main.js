import './style.css'
import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import router from './routes/router'
import App from './App.vue'
import * as userStore from './stores/userStore'
const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {},
})

const pinia = createPinia()
myApp.use(pinia)
myApp.use(router)
myApp.mount('#app')
myApp.provide('userStore', userStore)
