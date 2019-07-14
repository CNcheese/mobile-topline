import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 加载中文语言包
import relativeTime from 'dayjs/plugin/relativeTime' // dayjs 的 相对时间插件
dayjs.extend(relativeTime) // 把插件注册到 dayjs 中

dayjs.locale('zh-cn') // 配置使用中文语言包
Vue.filter('relativeTime', value => {
  return dayjs().from(value)
})

Vue.use(VeeValidate, {
  events: ''
})

Validator.localize('zh_CN', zhCN)

Vue.use(Vant)
Vue.use(Lazyload)
Vue.config.productionTip = false

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
