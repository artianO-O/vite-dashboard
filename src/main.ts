import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './route/index';
import App from './App.vue'

import 'element-plus/dist/index.css'
import './scss/publicReset.scss'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
