/*
 * @Description: 增加全局组件-CContent
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-24 18:13:00
 * @LastEditTime: 2021-01-08 15:38:37
 */
// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import CContent from '@/components/CLayout'
import VueDraggableResizable from 'vue-draggable-resizable'
import { filterParams, allInputChange } from './utils/common'
import xttp from './api/index'
// 导出
import { exportHandel } from '@/utils/exportImport' 

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('CContent', CContent)
Vue.component('vue-draggable-resizable', VueDraggableResizable)

Vue.prototype.$filterParams = filterParams
Vue.prototype.$allInputChange = allInputChange // 用于处理闲置非金钱数字的输入
Vue.prototype.$exportHandel = exportHandel //导出
Vue.prototype.$xttp = xttp //全局引入api
window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
