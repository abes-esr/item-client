// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'
import vuetify from '@/plugins/vuetify'

const app = createApp(App)
app.config.productionTip = false

const pinia = createPinia()

registerPlugins(app)

app.use(router).use(vuetify).use(pinia)
app.mount('#app')
