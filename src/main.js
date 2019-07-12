import Vue from 'vue';
import './plugins/vuetify';
import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
