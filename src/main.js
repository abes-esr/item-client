// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';
import router from '@/router';
import { createPinia } from 'pinia';
import VueMatomo from 'vue-matomo';

const app = createApp(App);
app.config.productionTip = false;

const pinia = createPinia();

registerPlugins(app);
// utilisation de piwik/matomo uniquement en production
if (import.meta.env.VITE_API_URL.includes('item.sudoc')) {
  app.use(VueMatomo, {
    host: 'https://piwik.abes.fr/',
    siteId: 25,
    trackerFileName: 'matomo',
    router: router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: false,
    enableHeartBeatTimer: false,
    heartBeatTimerInterval: 15,
    debug: true,
    userId: undefined,
    cookieDomain: undefined,
    domains: undefined,
    preInitActions: []
  });
}
app.use(router)
  .use(pinia);
app.mount('#app');
