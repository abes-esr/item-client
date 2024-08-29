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

function generateRandomHexColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];

  }
  return color;
}

//CUstom
const itemLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#295494',
    'primary-darken-1': '#1F5592',
    secondary: '#252C61',
    'secondary-darken-1': '#018786',
    textColor: '#FFFFFF',
    error: '#a32525',
    info: '#326bb1',
    success: '#4da432',
    warning: '#ec6839',
    disabled: '#808080'
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  }
}
const itemDarkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#404552',
    'primary-darken-1': '#1F5592',
    secondary: '#383c4a',
    'secondary-darken-1': '#018786',
    textColor: '#FFFFFF',
    error: '#a32525',
    info: '#5294e2',
    success: '#4da432',
    warning: '#ec6839',
    disabled: '#4b5162'
  },
  variables: {
    'border-color': '#FFFFFF',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  }
}
const itemRngTheme = {
  "dark": false,
  "colors": {
    "background": generateRandomHexColor(),
    "surface": generateRandomHexColor(),
    "surface-bright": generateRandomHexColor(),
    "surface-light": generateRandomHexColor(),
    "surface-variant": generateRandomHexColor(),
    "on-surface-variant":generateRandomHexColor(),
    "primary": generateRandomHexColor(),
    "primary-darken-1": generateRandomHexColor(),
    "secondary": generateRandomHexColor(),
    "secondary-darken-1": generateRandomHexColor(),
    textColor: generateRandomHexColor(),
    error: generateRandomHexColor(),
    info: generateRandomHexColor(),
    success: generateRandomHexColor(),
    warning: generateRandomHexColor(),
    disabled: generateRandomHexColor()
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: { fr, en },
  },
  theme: {
    defaultTheme: 'itemLightTheme',
    themes: {
      itemLightTheme,
      itemDarkTheme,
      itemRngTheme
    },
  }
})
