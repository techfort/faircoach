import { createApp } from "vue";
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faPause, faStop, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from "./App.vue";
import router from "./router";
// import "./index.css";
import "@/assets/styles/main.css";

library.add(faPlay, faPause, faStop, faXmark);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.mount("#app");
