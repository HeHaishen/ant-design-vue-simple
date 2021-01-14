<!--
 * @Description: 核查报告
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2021-01-04 09:35:41
 * @LastEditTime: 2021-01-06 17:16:13
-->
<template>
  <a-modal
    title="检查报告"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    width="85%"
    okText="提交"
    :ok-button-props="{ props: { disabled: true } }"
    cancelText="关闭"
  >
    <div class="c-show-report"></div>
  </a-modal>
</template>
<script>
export default {
    data(){
        return {
            visible:false,
            confirmLoading:false,
            innerhtml:null
        }
    },
    created() {
        
    },
    mounted() { 
        this.$on('show',(data)=>{
            this.visible = true
            this.confirmLoading = false
            this.$nextTick(()=>{
                document.querySelector('c-show-report')
                const divs = document.querySelector('.c-show-report')
                divs.innerHTML = data
                this.confirmLoading = false
            })
        })
    },
    methods:{
        handleOk(){

        },
        handleCancel(){
            this.visible = false
        }
    }
}
</script>