// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
// eslint-disable-next-line import/no-unresolved
import App from './App';
import router from './router';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
  theme: {
    primary: '#295494',
    secondary: '#252C61',
    accent: '#980827',
    error: '#a32525',
    warning: '#ec6839',
    info: '#326bb1',
    success: '#4da432',
  },
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
