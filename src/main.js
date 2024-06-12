// Plugins
import {registerPlugins} from '@/plugins'

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'
import { createVuetify } from 'vuetify'
import router from './router/router'
import {en, fr} from 'vuetify/locale'
import { VStepperVertical } from 'vuetify/labs/components'

const app = createApp(App)

const vuetify = createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: { fr, en },
  },
  components: {
    VStepperVertical
  }
})

registerPlugins(app)

app.use(router).use(vuetify)
app.mount('#app')
