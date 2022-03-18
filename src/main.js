/*
 * @Description: 
 * @Version: 2.0
 * @Autor: fyf
 * @Date: 2022-03-18 13:29:43
 * @LastEditors: fyf
 * @LastEditTime: 2022-03-18 14:03:55
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import component from './components/index.js'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
// Vue.use(component)

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(component)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
