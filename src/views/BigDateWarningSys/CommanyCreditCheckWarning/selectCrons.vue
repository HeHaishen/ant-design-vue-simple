<!--
 * @Description: 信用监测预警-选择周期表达式
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2021-01-08 10:43:03
 * @LastEditTime: 2021-01-08 11:45:39
-->
<template>
  <a-modal
    :title="pageTitle"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    width="85%"
    okText="提交"
    cancelText="关闭"
  >
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-form-item :label="formLable.second.text">
        <a-select
          allowClear
          :maxLength="formLable.second.maxLength"
          :placeholder="formLable.second.placeholder"
          v-decorator="formLable.second.check"  
        >
          <a-select-option v-for="(i,k) in 60" :value="k" :key="k">
            {{ k }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="formLable.minute.text">
        <a-select
          allowClear
          :maxLength="formLable.minute.maxLength"
          :placeholder="formLable.minute.placeholder"
          v-decorator="formLable.minute.check"  
        >
          <a-select-option v-for="(i,k) in 60" :value="k" :key="k">
            {{ k }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="formLable.hours.text">
        <a-select
          allowClear
          :maxLength="formLable.hours.maxLength"
          :placeholder="formLable.hours.placeholder"
          v-decorator="formLable.hours.check"  
        >
          <a-select-option v-for="(i, k) in 24" :value="k" :key="k">
            {{ k }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="formLable.day.text">
        <a-select
          allowClear
          :maxLength="formLable.day.maxLength"
          :placeholder="formLable.day.placeholder"
          v-decorator="formLable.day.check"  
        >
          <a-select-option v-for="(i) in 31" :value="i" :key="i">
            {{ i }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="formLable.week.text">
        <a-select
          allowClear
          :maxLength="formLable.week.maxLength"
          :placeholder="formLable.week.placeholder"
          v-decorator="formLable.week.check"  
        >
          <a-select-option v-for="(i) in 7" :value="i" :key="i">
            {{ i }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="formLable.month.text">
        <a-select
          allowClear
          :maxLength="formLable.week.maxLength"
          :placeholder="formLable.week.placeholder"
          v-decorator="formLable.week.check"  
        >
          <a-select-option v-for="(i) in 31" :value="i" :key="i">
            {{ i }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

  </a-modal>
</template>
<script>
export default {
    data () {
        return {
          pageTitle:'选择触发周期',
          visible: false,
          confirmLoading: false,
          form: this.$form.createForm(this),
          formLable: {
            second: {
                text: '秒',
                placeholder: '请选择',
                maxLength:200,
                check: [
                    'second',
                    { rules: [{ required: false, message: '请选择' }] }
                ]
            },
            minute: {
                text: '分',
                    placeholder: '请选择',
                    maxLength:200,
                    check: [
                        'minute',
                    { rules: [{ required: false, message: '请选择' }] }
                    ]
            },
            hours: {
                text: '小时',
                    placeholder: '请选择',
                    check: [
                    'hours',
                    { rules: [{ required: false, message: '请选择' }] }
                    ]
            },
            day: {
                text: '日',
                placeholder: '请选择',
                check: [
                    'day',
                { rules: [{ required: false, message: '请选择'}] }
                ]
            },
            week: {
                text: '周',
                placeholder: '请选择',
                check: [
                'week',
                { rules: [{ required: false, message: '请选择' }] }
                ]
            },
            month: {
                text: '月',
                placeholder: '请选择',
                check: [
                'month',
                { rules: [{ required: false, message: '请选择' }] }
                ]
            },
            year: {
                text: '年',
                placeholder: '请选择',
                check: [
                'year',
                { rules: [{ required: true, message: '请选择' }] }
                ]
            },
          },
        }
    },
    mounted () {
      this.$on('show',(data)=>{
          this.visible = true
      })
    },
    methods: {
        handleOk () {},
        handleCancel () {
          this.visible =  false
        }
    }
}
</script>
