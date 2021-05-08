import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Toasted from 'vue-toasted'
import store from './store'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(Toasted)

Vue.router = router
Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL
Vue.prototype.moment = moment
let defaultLocale = ''

if (localStorage.locale) {
  if (localStorage.locale === 'fi' || localStorage.locale === 'en'  || localStorage.locale === 'ru'  || localStorage.locale === 'sv') {
    defaultLocale = localStorage.getItem('locale')
  } else {
    defaultLocale = 'fi'
    localStorage.setItem('locale', defaultLocale)
  }
} else {
  defaultLocale = 'fi'
  localStorage.setItem('locale', defaultLocale)
}

const pixelache = new Vue({ data: { locale: 'fi', slug: 'festival-2021' }})
const i18n = new Vue({ data: { locale: defaultLocale}})
const texts = require('@/texts.json')
pixelache.install = function(){
  Object.defineProperty(Vue.prototype, '$pixelache', {
    get () { return pixelache }
  })
}

i18n.install = function(){
  Object.defineProperty(Vue.prototype, '$i18n', {
    get () { return i18n }
  })
  Object.defineProperty(Vue.prototype, '$texts', {
    get () { return texts }
  })
}

Vue.use(pixelache)
Vue.use(i18n)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
