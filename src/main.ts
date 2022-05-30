import { createApp } from "vue";
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from "./App.vue";
import router from "./router";
// import "./index.css";
import "@/assets/styles/main.css";

library.add(faUserSecret, faCoffee);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.mount("#app");
