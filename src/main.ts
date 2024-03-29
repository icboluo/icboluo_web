import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import element from 'element-plus'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(element)

app.mount('#app')
