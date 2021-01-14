/*
 * @Description: 添加判断条件
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-24 18:13:00
 * @LastEditTime: 2021-01-12 12:07:54
 */
import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { globalUrl } from '@/utils/configUrl'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/creditCheck/creditCheck'
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (storage.get(ACCESS_TOKEN) && to.path !== loginRoutePath) {
    if (to.path === loginRoutePath) {
      // console.log(222, to, from, next, Object.keys(to.query).slice('token')[1],)
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // console.log(69966999,storage.get(ACCESS_TOKEN))
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo',)
          .then(res => {
            console.log(777777, res)
            // debugger
            if(res.success){
              const roles = res.result && res.result.role
              // generate dynamic router
              store.dispatch('GenerateRoutes', { roles }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                console.log('jjjj',to,from,router)
                router.addRoutes(store.getters.addRouters)
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            }else{
              window.location.href = globalUrl
            }
          })
          .catch((error) => {
            
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            console.log(error)
            debugger
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
              // window.location.href = globalUrl
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      // next()
      try {
        if(to.query && Object.keys(to.query).length && Object.keys(to.query)[0].split('token=')[1]){
          store.dispatch('verificationTokens',{token:Object.keys(to.query)[0].split('token=')[1]}).then((res)=>{
            console.log('persiom',res)
            if(res.success){
              // debugger
              const roles = res.result && res.result.role
              // generate dynamic router
              store.dispatch('GenerateRoutes', { roles }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                
                router.addRoutes(store.getters.addRouters)
                next({ path: '/' })
                // next({ path: defaultRoutePath })
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                /* const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                } */
              })
            }else{
              next()
            }
          })
        }else{
          next()
        }
      } catch (error) {
        next()
      }
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
