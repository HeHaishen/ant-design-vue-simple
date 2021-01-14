// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/creditCheck',
    children: [
      {
        path: '/creditCheck',
        name: 'creditCheck',
        redirect: '/creditCheck/creditCheck',
        component: RouteView,
        meta: { title: '信用核查', keepAlive: true, icon: 'form', permission: ['dashboard'] },
        children: [
          {
            path: '/creditCheck/creditCheck',
            name: 'checkApply',
            component: () => import('@/views/creditCheck/checkApply'),
            meta: { title: '核查申请', keepAlive: true, permission: ['dashboard'] }
          },
          {
            path: '/creditCheck/batchCheckApply',
            name: 'batchCheckApply',
            component: () => import('@/views/creditCheck/batchCheckApply'),
            meta: { title: '批量核查申请', keepAlive: true, permission: ['dashboard'] }
          },
          {
            path: '/creditCheck/checkNameList',
            name: 'checkNameList',
            component: () => import('@/views/creditCheck/checkNameList'),
            meta: { title: '核查名单管理', keepAlive: true, permission: ['dashboard'] }
          },
          {
            path: '/creditCheck/checkCreditMain',
            name: 'checkCreditMain',
            component: () => import('@/views/creditCheck/checkCreditMain'),
            meta: { title: '核查信用主体', keepAlive: true, permission: ['dashboard'] }
          },
          {
            path: '/creditCheck/targetManagement',
            name: 'targetManagement',
            component: () => import('@/views/creditCheck/targetManagement'),
            meta: { title: '核查指标管理', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },
      // forms
      {
        path: '/InfoPerformanceSupervision',
        redirect: '/InfoPerformanceSupervision/dataImputation',
        component: RouteView,
        meta: { title: '信息督查绩效监管', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/InfoPerformanceSupervision/dataImputation',
            name: 'dataImputation',
            component: () => import('@/views/InfoPerformanceSupervision/dataImputation'),
            meta: { title: '数据归集统计', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/InfoPerformanceSupervision/dataUpdate',
            name: 'dataUpdate',
            component: () => import('@/views/InfoPerformanceSupervision/dataUpdate'),
            meta: { title: '数据更新统计', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/InfoPerformanceSupervision/formulaReport',
            name: 'formulaReport',
            component: () => import('@/views/InfoPerformanceSupervision/formulaReport'),
            meta: { title: '双公示上报统计', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/InfoPerformanceSupervision/creditApp',
            name: 'creditApp',
            component: () => import('@/views/InfoPerformanceSupervision/creditApp'),
            meta: { title: '信用应用统计表', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/InfoPerformanceSupervision/dataImputationSupervise',
            name: 'dataImputationSupervise',
            component: () => import('@/views/InfoPerformanceSupervision/dataImputationSupervise'),
            meta: { title: '数据归集督办', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/InfoPerformanceSupervision/dataUpdateSupervise',
            name: 'dataUpdateSupervise',
            component: () => import('@/views/InfoPerformanceSupervision/dataUpdateSupervise'),
            meta: { title: '数据更新督办', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/InfoPerformanceSupervision/applyObjectionSupervise',
            name: 'applyObjectionSupervise',
            component: () => import('@/views/InfoPerformanceSupervision/applyObjectionSupervise'),
            meta: { title: '异议申请督办', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      // list
      {
        path: '/BigDateWarningSys',
        name: 'BigDateWarningSys',
        component: RouteView,
        redirect: '/BigDateWarningSys/CommanyCreditCheckWarning',
        meta: { title: '大数据预警分析', icon: 'table', permission: ['table'] },
        children: [
          {
            // path: '/BigDateWarningSys/table-list/:pageNo([1-9]\\d*)?',
            path: '/BigDateWarningSys/CommanyCreditCheckWarning',
            name: 'CommanyCreditCheckWarning',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/BigDateWarningSys/CommanyCreditCheckWarning'),
            meta: { title: '企业信用监测预警', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/BigDateWarningSys/warningInfo',
            name: 'warningInfo',
            component: () => import('@/views/BigDateWarningSys/warningInfo'),
            meta: { title: '预警信息应用', keepAlive: true, permission: ['table'] }
          },
          // {
          //   path: '/list/search',
          //   name: 'SearchList',
          //   component: () => import('@/views/list/search/SearchLayout'),
          //   redirect: '/list/search/article',
          //   meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
          //   children: [
          //     {
          //       path: '/list/search/article',
          //       name: 'SearchArticles',
          //       component: () => import('../views/list/search/Article'),
          //       meta: { title: 'menu.list.search-list.articles', permission: ['table'] }
          //     },
          //     {
          //       path: '/list/search/project',
          //       name: 'SearchProjects',
          //       component: () => import('../views/list/search/Projects'),
          //       meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
          //     },
          //     {
          //       path: '/list/search/application',
          //       name: 'SearchApplications',
          //       component: () => import('../views/list/search/Applications'),
          //       meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
          //     }
          //   ]
          // }
        ]
      },

      // profile
      {
        path: '/creditSuperviseAppSys',
        name: 'creditSuperviseAppSys',
        component: RouteView,
        redirect: '/creditSuperviseAppSys/huaihuaDataAnalysis',
        meta: { title: '信用监管应用成效分析系统', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/creditSuperviseAppSys/huaihuaDataAnalysis',
            name: 'huaihuaDataAnalysis',
            component: () => import('@/views/creditSuperviseAppSys/huaihuaDataAnalysis'),
            meta: { title: '信用怀化数据分析', permission: ['profile'] }
          },
          {
            path: '/creditSuperviseAppSys/sincerityBusinessAnalysis',
            name: 'sincerityBusinessAnalysis',
            component: () => import('@/views/creditSuperviseAppSys/sincerityBusinessAnalysis'),
            meta: { title: '诚信商圈信用分析', permission: ['profile'] }
          }
        ]
      }
      // Exception
      // {
      //   path: '/exception',
      //   name: 'exception',
      //   component: RouteView,
      //   redirect: '/exception/403',
      //   meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
      //   children: [
      //     {
      //       path: '/exception/403',
      //       name: 'Exception403',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
      //       meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'Exception404',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
      //       meta: { title: 'menu.exception.not-find', permission: ['exception'] }
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'Exception500',
      //       component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
      //       meta: { title: 'menu.exception.server-error', permission: ['exception'] }
      //     }
      //   ]
      // },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
