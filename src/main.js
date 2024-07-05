// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import router from '@/router'
import { en, fr } from 'vuetify/locale'
import { createPinia } from 'pinia'

const app = createApp(App)
app.config.productionTip = false

const vuetify = createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: { fr, en },
  },
})

const pinia = createPinia()

registerPlugins(app)

app.use(router).use(vuetify).use(pinia)
app.mount('#app')
