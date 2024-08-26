/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'
import {en, fr} from 'vuetify/locale'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: { fr, en },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        primary: '#295494',
        secondary: '#252C61',
        accent: '#980827',
        error: '#a32525',
        warning: '#ec6839',
        info: '#326bb1',
        success: '#4da432',
        disabled: '#808080',
      },
      dark: {
        primary: '#404552',
        secondary: '#383c4a',
        accent: '#980827',
        error: '#a32525',
        warning: '#ec6839',
        info: '#5294e2',
        success: '#4da432',
        disabled: '#4b5162',
      },
    },
  },
})
