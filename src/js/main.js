/* App styles */
import "@/scss/main.scss";

/* Development stats */
import Development from './development.js';
if (process.env.NODE_ENV === "development") {Development.addWindowStatsElement();}

/* Preloader */
import preloader from './preloader.js';
preloader();

/* Vue app */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#vue-app');

console.log(`test5`);
