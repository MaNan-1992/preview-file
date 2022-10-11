import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueViewer from 'v-viewer';
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueViewer)

new Vue({
  render: h => h(App),
}).$mount('#app')
