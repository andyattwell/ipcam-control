import { createApp } from 'vue'
import App from './frontend/App'
import router from './frontend/router'
import 'bootstrap'; 
import 'bootstrap/scss/bootstrap.scss';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./frontend/assets/styles/style.scss";
import axios from "./frontend/utils/http-common"
import store from './frontend/store';

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.use(router)
app.use(store)
app.mount('#app')