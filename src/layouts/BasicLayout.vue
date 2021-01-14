<template>
  <div class="c-basic-layout">
    <div class="c-basic-top">
      <div class="c-basic-toptitle">
        <img src="~@/assets/logo1.png" alt="">
        <h1>信用怀化</h1>
      </div>
      <div>
        <a-tooltip title="收起侧边栏" class="c-aside-icon">
          <a-icon class="c-change-aside" type="menu-fold" @click="handleCollapse(collapsed?false:true)" />
        </a-tooltip>
        <!-- <a-tooltip title="刷新页面">
          <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="() => { $message.info('只是一个DEMO') }" />
        </a-tooltip> -->
      </div>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </div>
    <div class="c-basic-topmenu">
      <a-menu v-model="currentMenu" mode="horizontal">
        <a-menu-item v-for="( i ) in topAllMenu" :key="i.path" class="c-top-listtext" @click="topMenuHandel">{{ i.meta.title }}</a-menu-item>
      </a-menu>
    </div>
    <pro-layout
      :menus="menus"
      :collapsed="collapsed"
      :mediaQuery="query"
      :isMobile="isMobile"
      :handleMediaQuery="handleMediaQuery"
      :handleCollapse="handleCollapse"
      :i18nRender="i18nRender"
      v-bind="settings"
    >
      <router-view />
    </pro-layout>
  </div>
</template>

<script>
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import Ads from '@/components/Other/CarbonAds'
// self
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown'
export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
    Ads,
    AvatarDropdown
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end

      // base
      menus: [],
      timeOut: null,
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false,
        showMenu: true
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,
      currentUser: { name: 'test' },
      prefixCls: 'ant-pro-global-header-index-action',

      // 顶部菜单
      topAllMenu: [],
      currentMenu: []
    }
  },
  watch:{
    '$route':'routerChange'
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    })
  },
  created () {
    const topCurren = this.setTopSideType()
    const routes = this.mainMenu.find(item => item.path === '/')
    const menus = (routes && routes.children) || []
    this.topAllMenu = JSON.parse(JSON.stringify(menus))
    this.menus = [menus.find(item =>  item.path === topCurren)] 
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
      this.initLayoutSelf()
    })
    // this.currentMenu = topCurrent
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        const that = this
        this.timeOut = setTimeout(() => {
          this.collapsed = !this.collapsed
          clearTimeout(that.timeOut)
        }, 16)
      })
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
      updateTheme(this.settings.primaryColor)
    }
    this.$nextTick(() => {
      this.initLayoutSelf()
     
    })
  },
  methods: {
    i18nRender,
    routerChange (newVal, oldVal) {
      const keys = newVal.path
      const newPath =  keys.split('/')
      this.currentMenu = [ '/' + newPath[1] ]
    },
    setTopSideType () {
      let topCurrent = JSON.parse(JSON.stringify(this.$route.path))
      topCurrent = '/' + topCurrent.split('/')[1]
      this.currentMenu = [ topCurrent ]
      return topCurrent
    },
    topMenuHandel (value) {
      const clickKey = value.key
      const currentShow = this.topAllMenu.find(item => item.path === clickKey)
      this.menus = []
      this.menus.push(currentShow)
      let currentPath = JSON.parse(JSON.stringify(this.$route.path))
      currentPath = '/' + currentPath.split('/')[1]
      if(currentPath === clickKey){
      } else {
        this.$router.push({path: currentShow.path})
      }
    },
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
      console.log(val)
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    /*
      初始化需求的样式布局
    */
    initLayoutSelf () {
      const logDiv = document.querySelector('.ant-pro-sider-menu-logo')
      const heardDiv = document.querySelector('.ant-layout-header')
      logDiv.style.display = 'none'
      heardDiv.style.display = 'none'
    }
  },
  destroyed () {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
