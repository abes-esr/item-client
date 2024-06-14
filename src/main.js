// Plugins
import {registerPlugins} from '@/plugins'

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'
import { createVuetify } from 'vuetify'
import router from '@/router'
import {en, fr} from 'vuetify/locale'

const app = createApp(App)

const vuetify = createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: { fr, en },
  },
  symbol: {
    idefault: Symbol('idefault'),
    idisplay: Symbol('idisplay'),
    itheme: Symbol('itheme'),
    iicons: Symbol('iicons'),
    ilocale: Symbol('ilocale'),
    idateOptions: Symbol('idateOptions'),
    iadapter: Symbol('iadapter'),
    igoto: Symbol('igoto')
  }
})

registerPlugins(app)

app.use(router)
app.mount('#app')
