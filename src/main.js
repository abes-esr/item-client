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
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
      dark: {
        colors: {
          primary: '#FFC107',
          secondary: '#DBDBDB',
          accent: '#7D4E00',
          error: '#00ADAD',
          info: '#DE6900',
          success: '#B3AF00',
          warning: '#0038F8',
          background: '#000000',
          surface: '#121212',
          onPrimary: '#FFFFFF',
          onSecondary: '#FFFFFF',
          onAccent: '#FFFFFF',
          onError: '#FFFFFF',
          onInfo: '#FFFFFF',
          onSuccess: '#FFFFFF',
          onWarning: '#FFFFFF',
          onBackground: '#FFFFFF',
          onSurface: '#FFFFFF',
        },
      },
      blackAndWhite: {
        colors: {
          primary: '#000000',
          secondary: '#FFFFFF',
          accent: '#BDBDBD',
          error: '#808080',
          info: '#D3D3D3',
          success: '#A9A9A9',
          warning: '#DCDCDC',
        },
      },
    },
  },
})

registerPlugins(app)

app.use(router).use(vuetify)
app.mount('#app')
