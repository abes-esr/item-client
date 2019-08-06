import Vue from 'vue';
import vuetify from './plugins/vuetify';
import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  router,
}).$mount('#app');
