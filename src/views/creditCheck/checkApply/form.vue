<!--
 * @Description: 表单提交
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 10:13:12
 * @LastEditTime: 2021-01-13 11:56:01
-->
<template>
  <a-form :form="form" class="c-add-form">
    <a-form-item
      class="c-formitem"
      :label="formLable.entName.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol">
      <a-input 
        disabled
        v-decorator="formLable.entName.check"
        name="orgCode"
        :placeholder="formLable.entName.placeholder" />
      <a-button @click="selectCompany">选择</a-button>
    </a-form-item>
    <a-form-item
      :label="formLable.idcode.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol">
      <a-input
        disabled
        v-decorator="formLable.idcode.check"
        name="orgCode"
        :placeholder="formLable.idcode.placeholder" />
    </a-form-item>
    <a-form-item
      :label="formLable.legalPerson.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol">
      <a-input
        disabled
        v-decorator="formLable.legalPerson.check"
        name="legalPerson"
        :placeholder="formLable.legalPerson.placeholder" />
    </a-form-item>
    <a-form-item
      :label="formLable.purpose.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol">
      <a-textarea
        rows="4"
        allowClear
        :maxLength="formLable.purpose.maxLength"
        :placeholder="formLable.purpose.placeholder"
        v-decorator="formLable.purpose.check" />
    </a-form-item>
    <a-form-item
      :label="formLable.orgName.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol">
      <a-input
        allowClear
        :maxLength="formLable.orgName.maxLength"
        :placeholder="formLable.orgName.placeholder"
        v-decorator="formLable.orgName.check" />
    </a-form-item>
    <a-form-item
      :label="formLable.applicant.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input
        allowClear
        :maxLength="formLable.applicant.maxLength"
        :placeholder="formLable.applicant.placeholder"
        v-decorator="formLable.applicant.check" />
    </a-form-item>
    <a-form-item
      :label="formLable.tel.text"
      :labelCol="formLabelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input 
        allowClear
        :placeholder="formLable.tel.placeholder"
        v-decorator="formLable.tel.check"
      />
    </a-form-item>
    <a-form-item
      :wrapperCol="{ span: 24 }"
      style="text-align: center"
    >
      <a-button htmlType="submit" type="primary" @click="handleSubmit">提交</a-button>
      <a-button style="margin-left: 8px" @click="giveUpHandel">放弃</a-button>
    </a-form-item>
    <selectModel ref="selectModel" @selectSure="selectSure" />
  </a-form>
</template>
<script>
import selectModel from '@/views/creditCheck/checkApply/select'
export default {
    components: {
        selectModel
    },
    data () {
        return {
          formLabelCol: { lg: { span: 7 }, sm: { span: 7 } },
          wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
          formLable: {
              entName: {
                  text: '企业名称',
                  placeholder: '请输入企业名称',
                  check: [
                    'entName',
                    { rules: [{ required: true, message: '请输入企业名称' }] }
                  ]
              },
              idcode: {
                  text: '统一社会信用代码',
                  placeholder: '请输入统一社会信用代码',
                   check: [
                    'idcode',
                    { rules: [{ required: true, message: '请输入统一社会信用代码' }] }
                  ]
              },
              legalPerson: {
                   text: '企业法人',
                   placeholder: '请输入企业法人',
                    check: [
                    'legalPerson',
                    { rules: [{ required: true, message: '请输入企业法人' }] }
                  ]
              },
              purpose: {
                  text: '核查用途',
                  placeholder: '请输入核查用途',
                  maxLength:1000,
                  check: [
                    'purpose',
                    { rules: [{ required: true, message: '请输入核查用途' }] }
                  ]
              },
              orgName: {
                  text: '申请单位',
                   placeholder: '请输入申请单位',
                    maxLength:200,
                    check: [
                    'orgName',
                    { rules: [{ required: true, message: '请输入申请单位' }] }
                  ]
              },
              applicant: {
                  text: '申请人',
                   placeholder: '请输入申请人',
                   maxLength:50,
                   check: [
                    'applicant',
                    { rules: [{ required: true, message: '请输入申请人' }] }
                   ]
              },
              tel: {
                  text: '申请人联系电话',
                  placeholder: '请输入申请人联系电话',
                  check: [
                    'tel',
                    { rules: [{ required: true, message: '请输入申请人联系电话' }, { validator: this.phoneCheck.bind(this) }] }
                   ]
              }
          },
          form: this.$form.createForm(this)
        }
    },
    methods: {
      handleSubmit (e) {
            this.form.validateFields((err, values) => {
                if (!err) {
                  this.$xttp.creditCheckApi.saveCreditCheck(
                    values
                  ).then((res)=>{
                    if(res.success){
                      this.$message.success('保存成功！')
                      this.$router.push({path:'/creditCheck/checkCreditMain'})
                    }else{
                      this.$message.error(res.message)
                    }
                  }).catch((error)=>{
                    if(error){
                      this.$message.error('网络异常，请刷新重试！')
                    }
                  })
                }
            })
       },
       selectCompany () {
           this.$refs.selectModel.$emit('show')
       },
       selectSure(value){
         console.log(value)
         this.form.setFieldsValue({
            entName: value.qymc,
            idcode: value.tyshxydm,
            legalPerson: value.fddbr
         })
       },
       // 手机号码校验
        phoneCheck (rule, value, callbackFn) {
          const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
          if (!reg.test(value)) {
            callbackFn('手机号码格式不正确')
            return
          }
          callbackFn()
        },
        // 放弃
        giveUpHandel () {
          const that = this
          this.$confirm({
            title: '提示',
            content: '确定放弃此次操作？',
            okText: '确认',
            cancelText: '取消',
            onOk () {
              that.loading = true
              that.$router.push({path:'/creditCheck/checkCreditMain'})
            },
            onCancel () {
            }
          })
        }
  }
}
</script>
<style lang="less" scoped>
    .c-formitem .ant-form-item-control-wrapper .ant-form-item-control .ant-form-item-children{
       button{
           display:block;
           position:absolute;
           right:-70px;
           top:-10px;
       }
    }
</style>
