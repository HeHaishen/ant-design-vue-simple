<!--
 * @Description: 信用核查-核查名单管理详情
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2021-01-06 11:10:04
 * @LastEditTime: 2021-01-12 14:23:42
-->
<!--
 * @Description: 信用核查-新增名单
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 19:27:59
 * @LastEditTime: 2021-01-05 12:05:33
-->
<template>
  <a-modal   
    :title="pageTitle"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    width="85%"
    :footer="pageType === 'detail' ? null : true"
    okText="提交"
    cancelText="关闭"
  >
    <!-- <CContent :titleShow="false" :formShow="false">
      <template v-slot:contentDetail> -->
    <a-spin :spinning="spinning">
      <p class="c-form-sleftitle">
        申请信息
      </p>
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item
              :label="formLable.orgName.text">
              <a-input
                :disabled="pageType === 'detail'"
                allowClear
                :maxLength="formLable.orgName.maxLength"
                :placeholder="formLable.orgName.placeholder"
                v-decorator="formLable.orgName.check" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              :label="formLable.applicant.text">
              <a-input
                :disabled="pageType === 'detail'"
                allowClear
                :maxLength="formLable.applicant.maxLength"
                :placeholder="formLable.applicant.placeholder"
                v-decorator="formLable.applicant.check" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item
              :label="formLable.tel.text">
              <a-input
                :disabled="pageType === 'detail'"
                allowClear
                :maxLength="formLable.tel.maxLength"
                :placeholder="formLable.tel.placeholder"
                v-decorator="formLable.tel.check" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 15, offset: 1}" :lg="6" :md="12" :sm="24" >
            <a-form-item
              :label="formLable.purpose.text">
              <a-input
                :disabled="pageType === 'detail'"
                type="textarea"
                :rows="4"
                allowClear
                :maxLength="formLable.purpose.maxLength"
                :placeholder="formLable.purpose.placeholder"
                v-decorator="formLable.purpose.check" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <div class="c-div-button" v-if="pageType !== 'detail'">
              <a-button type="primary" @click="handleSubmit">提交</a-button>
              <a-button type="danger" >放弃</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
      <div class="c-form-sleftitle" style="position:relative;">
        申请核查企业列表
        <div class="c-content-tables" style="position:absolute;right:0;top:8px;">
          <a-button v-show="pageType !== 'detail'" type="primary" class="c-float-bottom" @click="addNameListHandel">新增名单</a-button>
          <a-select
            v-show="false"
            :disabled="pageType === 'detail'"
            v-model="selectNameId"
            allowClear
            class="c-float-bottom"
            show-search
            placeholder="请选择公司名单"
            option-filter-prop="children"
            style="width: 200px"
            :filter-option="filterOption"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
          >
            <a-select-option v-for="(item) in searchList" :key="item.sid" :value="item.sid">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="c-modal-content">
        <a-table border :columns="columns" :data-source="listDatas" :pagination="pagination" :rowKey="record=>record.sid">
          <template slot="operation" slot-scope="text, record, index">
            <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button>
          </template>
        </a-table>
      </div>
    </a-spin>
    <!-- </template>
    </CContent> -->
  </a-modal>
</template>
<script>
import moment from 'moment'
const columns = [
  //  {
  //       title: '选择',
  //       key: 'operation',
  //       scopedSlots: { customRender: 'operation' },
  //        width: 40
  //   },
    {
        title: '企业名称',
        dataIndex: 'entName',
        width: 200
    },
    {
        title: '统一社会信用代码',
        dataIndex: 'idcode',
        width: 120
    },
    {
        title: '企业法人',
        dataIndex: 'legalPerson',
        width: 100
    }
]
export default {
  data () {
    return {
      pageTitle: '',
      visible: false,
      confirmLoading: false,
      pageType: 'add',
      spinning: false,
      // 业务逻辑
      parentDatas: {},
      form: this.$form.createForm(this),
      formLable: {
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
      },
      pagination: {
        total: 0,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '40'],
        // eslint-disable-next-line no-return-assign
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columns,
      listDatas: [],
      searchList: [],
      selectNameId: null,
      selectObj: {}
    }
  },
  computed: {},
  mounted () {
    this.$on('show', data => {
      this.visible = true
      this.pageType = data.pageType
      console.log(data,this.pageType)
      const pageType = {
        edit:'编辑',
        add:'新增',
        detail:'详情'
      }
      // pageType：edit-编辑,add-新增,detail-详情
      this.pageTitle = pageType[ data.pageType ] 
      this.parentDatas = data
      this.$nextTick(()=>{
        this.initData(()=>{
          this.form.resetFields({
            orgName: null,
            applicant: null,
            tel: null,
            purpose: null
          })
          if ( this.pageType === 'add' ) {

          } else if ( this.pageType === 'detail' || this.pageType === 'edit') {
            this.form.setFieldsValue({
                orgName: JSON.parse(JSON.stringify(data.orgName)),
                applicant: JSON.parse(JSON.stringify(data.applicant)),
                tel: JSON.parse(JSON.stringify(data.tel)),
                purpose: JSON.parse(JSON.stringify(data.purpose))
            })
            this.listDatas =  data.creditCheckEntInfos
            this.selectNameId = data.creditCheckEntInfos && data.creditCheckEntInfos.length ? data.creditCheckEntInfos[0].mid : null
         } else {
            this.$message.warning('位置状态，请检查传入pageType')
          }
          this.getNameListFind()
        })
      })
    })
  },
  methods: {
    initData (callBack) {
      this.parentDatas = {}
      this.searchList = []
      this.listDatas = []
      this.selectNameId = null
      this.selectObj = {}
      this.pagination = {
        total: 0,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '40'],
        // eslint-disable-next-line no-return-assign
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      }
      callBack()
    },
    handleOk () {
        this.visible = false
    },
    handleCancel () {
        this.visible = false
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
    // 获取企业名单
    getNameListFind (send = {},callBack = ()=>{}) {
      this.spinning = true
      this.$xttp.creditCheckApi.getNameListFind(
        {
          body:{},
          pageSize:1000,
          page:1
        }
      ).then((res)=>{
        if(res.success){
          this.searchList = res.body ? res.body : []
          this.spinning = false
          callBack()
        }else{
          this.$message.error(res.message)
          this.spinning = false
        }
      }).catch((error)=>{
        this.spinning = false
        this.$message.error('获取企业名单错误！')
      })
    },
    handleSubmit () {
      this.spinning = true
        this.form.validateFields((err, values) => {
          if (!err) {
            if(this.listDatas.length){
              const send = values
              send.mid = this.selectNameId
              this.$xttp.creditCheckApi.saveBatchCreditCheck(
                send
              ).then((res)=>{
                if(res.success){
                  this.spinning = false
                  this.$message.success('保存成功！')
                  this.$router.push({path:'/creditCheck/checkCreditMain'})
                }else{
                  this.$message.error(res.message)
                  this.spinning = false
                }
              }).catch((error)=>{
                if(error){
                  this.spinning = false
                  this.$message.error('网络异常，请刷新重试！')
                }
              })
            }else{
              this.spinning = false
              this.$message.warning('请选择企业名单')
            }
          }else{
            this.spinning = false
            this.$message.warning('请填写相关信息！')
          }
      })
    },
    /* 选择公司名单 */
    handleChange (value) {
      if(value){
        this.selectNameId =  value
        const saveSelect = this.searchList.find((i,k)=>{if(i.sid === value){return i}})
        this.selectObj =  JSON.parse(JSON.stringify(saveSelect))
        if(saveSelect && saveSelect.creditCheckEntInfos && saveSelect.creditCheckEntInfos.length){
          this.selectChangeGetNameList(saveSelect.creditCheckEntInfos)
        }else{
          this.listDatas = []
          // this.$message.warning('该名单为空，请重新选择')
        }
      }else{
        this.selectNameId =  null
        // this.searchList = []
        this.listDatas = []
      }
    },
    handleBlur (value) {
      // console.log('blur',value)
    },
    handleFocus () {
      
    },
    // 选择名称后获取名单
    selectChangeGetNameList(list){
      this.listDatas = list
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
     /* 删除 */
    deleteHandel (text, record, index) {
       const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除此项目？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.spinning = true
          that.$xttp.acceptanceApi.implementChildDelete({ sid }).then(res => {
            that.spinning = false
            if (res.success) {
              that.$message.success('删除成功！')
            } else {
              console.log('删除请求失败！', res.message)
              that.$message.error('删除请求失败！' + res.message)
            }
          })
            .catch(error => {
              if (error) {
                that.$message.error('删除失败！')
              }
            })
        },
        onCancel () {
        }
      })
    },
    /* 新增名单 */
    addNameListHandel () {
      if(this.selectNameId){
        this.selectObj.pageType = 'edit'
        this.$refs.addNameList.$emit('show',this.selectObj)
      }else{
        this.$refs.addNameList.$emit('show',{pageType: 'add'})
      }
    },
    // 新增名单成功后
    addSystemSuccess () {
      this.getNameListFind({}, ()=>{
        if(this.selectNameId){
          this.handleChange(this.selectNameId)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.c-div-button{
  height:137px;
  display:flex;
  justify-content: space-around;
  align-items: center;
}
.c-float-bottom{
  float:right;
  margin-right:16px;
}
</style>
