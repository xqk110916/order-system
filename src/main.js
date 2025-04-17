import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import request from './utils/request'
import Vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
app.use(router)
app.config.globalProperties.$request = request
app.use(Vant);

app.mount('#app')
