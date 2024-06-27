// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import router from '@/router'
import { en, fr } from 'vuetify/locale'

const app = createApp(App)
app.config.productionTip = false

const vuetify = createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: { fr, en },
  },
})

registerPlugins(app)

app.use(router).use(vuetify)
app.mount('#app')
