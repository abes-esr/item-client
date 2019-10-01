import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
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
    },
  },
});
