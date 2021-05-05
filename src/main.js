import Vue from 'vue'
import App from './App'
import request from './utils/reuqest';

Vue.config.productionTip = false

Vue.use(request);

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
