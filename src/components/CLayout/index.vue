<!--
 * @Description: 所有内容-样式组件
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2020-12-30 12:00:24
-->
<template function>
  <div class="c-content">
    <div class="c-content-inner">
      <div class="c-content-title" v-if="titleShow">
        <span class="c-title-type"></span>
        <span class="c-title-text">{{ titleTextShow }}</span>
      </div>
      <div class="contentDetail">
        <div class="c-content-search">
          <a-form v-if="formShow" layout="inline" :form="formData">
            <slot name="contentinlineForm">
            </slot>
          </a-form>
          <slot v-else name="contentinlineForm">
          </slot>
        </div>
        <div class="c-content-table">
          <slot name="contentDetail">
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
          titleTextShow: ''
      }
  },
  props: { 
    titleText: {
      type: String,
      default: '',
      requeit: false
    },
    formData: {
      type: Object,
      default: () => { return {} },
      requeit: false
    },
    /* 是否显示使用表单 */
    formShow: {
      type: Boolean,
      default: false
    },
    /* 是否显示使用titlie */
    titleShow: {
      type: Boolean,
      default: true
    }
  },
  created () {
      if (this.titleText) {
        this.titleTextShow = this.titleText
      } else {
        this.titleTextShow = this.$route.meta.title
      }
  },
  mounted () {
    this.$nextTick(() => {
        this.initPage()
    })
  },
  methods: {
      initPage () {
          const warpDivHeight = document.querySelector('body').clientHeight
           document.querySelector('.c-content').style.height = warpDivHeight - 110 + 'px'
      }
  }
}
</script>
