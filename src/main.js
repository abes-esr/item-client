import Vue from 'vue';
import vuetify from './plugins/vuetify';
import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;


new Vue({
  vuetify,
  render: h => h(App),
  router,
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
}).$mount('#app');
