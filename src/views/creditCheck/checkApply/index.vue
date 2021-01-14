<!--
 * @Description: 信用核查-核查申请
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2020-12-29 16:17:07
-->
<template>
  <CContent>
    <template v-slot:contentDetail>
      <formsDiv></formsDiv>
    </template>
  </CContent>
</template>
<script>
import formsDiv from './form'
export default {
    components: { formsDiv },
  data () {
      return {
      }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
  }
}
</script>
