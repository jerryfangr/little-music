import Vue from 'vue'
import App from './App'
import store from './store'
import request from './utils/reuqest';

Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.use(request);

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
