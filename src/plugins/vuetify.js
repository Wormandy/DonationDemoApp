import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#4c9cf7',
        secondary: '#424242',
        accent: '#000',
        tooltip: '#f5f5f5',
        lines: '#ddd',
        error: '#FF5252',
        info: '#FFF',
        success: '#4CAF50',
        warning: '#FFC107',
        textcolor: '#808080'
      }
    },
    options: {
      customProperties: true
    }
  },
  icons: {
    iconfont: 'fa'
  }
})
