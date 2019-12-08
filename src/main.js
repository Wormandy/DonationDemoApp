/* eslint-disable no-trailing-spaces */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import Alert from '@/components/alert/Alert'
import VueTheMask from 'vue-the-mask'
import VCurrencyField from 'v-currency-field'
import { VTextField } from 'vuetify/lib'
import Vue2Filters from 'vue2-filters'
import '@/plugins/vee-validate'

Vue.use(VueTheMask)
Vue.use(Vue2Filters)

Vue.component('v-text-field', VTextField)
Vue.use(VCurrencyField, { 
  locale: 'en-US',
  currency: 'USD',
  decimalLength: 2,
  autoDecimalMode: false,
  distractionFree: false,
  min: 0,
  max: null,
  defaultValue: 0
})

Vue.config.productionTip = false
Vue.component('app-alert', Alert)

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
