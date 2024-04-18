import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入echarts
import * as echarts from 'echarts'
import 'echarts-liquidfill'
// 引入datav
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)
// echarts挂载
Vue.prototype.$echarts = echarts
// element挂载
Vue.use(ElementUI)
// 严格模式
Vue.config.productionTip = false
// 事件中央总线
Vue.prototype.$bus = new Vue()
// 粒子背景
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
// 模态框拖拽
import '@/util/directives'
// 权限
import hasPermission from './util/permission'
Vue.prototype.$has = hasPermission.hasPermission
Vue.prototype.$hasRouter = hasPermission.routerPermission
// 时间
import { timesfun } from '@/util/timeData'
Vue.prototype.$formatterDate = timesfun(new Date()).slice(0, 10)
import exportPdf from '@/util/exportPdf'
Vue.use(exportPdf)

// 影藏下拉框
import { visibleChange } from '@/util/visibleChange'
Vue.prototype.$visibleChange = visibleChange
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
