<!--
 * @Description: 信用核查-新增名单
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 19:27:59
 * @LastEditTime: 2021-01-13 15:28:56
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
    <!-- <CContent :titleShow="false" :formShow="false">
      <template v-slot:contentDetail> -->
    <a-spin :spinning="spinning">
      <a-form :form="form" class="form">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item
              :label="formLable.themeName.text">
              <a-input
                allowClear
                :placeholder="formLable.themeName.placeholder"
                :maxLength="formLable.themeName.maxLength"
                v-decorator="formLable.themeName.check" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              :label="formLable.superviseName.text">
              <a-input
                allowClear
                :placeholder="formLable.superviseName.placeholder"
                :maxLength="formLable.superviseName.maxLength"
                v-decorator="formLable.superviseName.check" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item
              class="c-lineform-data"
              :label="formLable.status.text">
              <a-select
                allowClear
                :maxLength="formLable.status.maxLength"
                :placeholder="formLable.status.placeholder"
                v-decorator="formLable.status.check">
                <a-select-option value="1">使用</a-select-option>
                <a-select-option value="2">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item
              :label="formLable.superviseCount.text">
              <a-input
                allowClear
                :maxLength="formLable.superviseCount.maxLength"
                :placeholder="formLable.superviseCount.placeholder"
                v-decorator="formLable.superviseCount.check" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              class="c-lineform-data"
              :label="formLable.warningThreshold.text">
              <a-select
                allowClear
                mode="tags"
                @change="moreSelectChange"
                :placeholder="formLable.warningThreshold.placeholder"
                v-decorator="formLable.warningThreshold.check">
                <a-select-option key="1">信用分波动</a-select-option>
                <a-select-option key="2">行政处罚</a-select-option>
                <a-select-option key="3">黑名单信息</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item
              :label="formLable.threshold.text">
              <a-input
                allowClear
                :disabled="formLable.threshold.disabled"
                :placeholder="formLable.threshold.placeholder"
                :maxLength="formLable.threshold.maxLength"
                v-decorator="formLable.threshold.check" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="{span: 7, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item
              :label="formLable.cycle.text">
              <!-- <a-input
                style="width:60%"
                allowClear
                :disabled="formLable.cycle.disabled"
                :maxLength="formLable.cycle.maxLength"
                :placeholder="formLable.cycle.placeholder"
                v-decorator="formLable.cycle.check" /> -->
              <j-cron ref="innerVueCron" v-decorator="formLable.cycle.check" @change="setCorn"></j-cron>
              <!-- <a-button style="margin: 0 0 0 6px;vertical-align: text-top;" @click="slectCron">选择</a-button> -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="c-form-sleftitle" style="position:relative;">
        申请核查企业列表
        <div class="c-content-tables" style="position:absolute;right:0;top:8px;">
          <a-button type="primary" class="c-float-bottom" @click="addNameListHandel">新增名单</a-button>
          <a-select
            allowClear
            class="c-float-bottom"
            show-search
            v-model="selectValue"
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
      <a-table
        width="100%"
        v-if="visible"
        :columns="columns"
        :dataSource="listData"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :rowKey="(record, index) => index"
      >
        <template slot="norder" slot-scope="text, record">
          <a-input v-model="record.norder"></a-input>
        </template>
        <template slot="operation" :slot-scope="currentPageData" lot-scope="text, record, index">
          <a-button @click="deleteHandel(text, record, index)" type="link">删除</a-button>   
        </template>
      </a-table>
      <addNameList ref="addNameList" @addSystemSuccess="addSystemSuccess" />
      <selectCrons ref="selectCrons" />
    </a-spin>
    <!-- </template>
    </CContent> -->
  </a-modal>
</template>
<script>
import moment from 'moment'
import addNameList from './addCheckList'
import selectCrons from './selectCrons'
import JCron from '@/components/cron/JCron.vue'
const columns = [
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
  components:{ addNameList, selectCrons, JCron },
  data () {
    return {
      pageTitle: '',
      parentDatas: {},
      sendForm:{},
      tagerSlectLsit:[],
      searchList:[],
      form: this.$form.createForm(this),
      columns,
      confirmLoading: false,
      visible: false,
      spinning:false,
      loading: false,
      formLable: {
        themeName: {
          text: '信用预警主题',
          placeholder: '请输入信用预警主题',
          maxLength:200,
          check: [
            'themeName',
            { rules: [{ required: true, message: '请输入信用预警主题' }] }
          ]
        },
        superviseName: {
          text: '监管部门',
              placeholder: '请输入监管部门',
              maxLength:200,
              check: [
                'superviseName',
              { rules: [{ required: true, message: '请输入监管部门' }] }
              ]
        },
        status: {
          text: '使用状态',
            placeholder: '请选择使用状态',
            check: [
              'status',
              { rules: [{ required: true, message: '请选择使用状态' }] }
            ]
        },
        superviseCount: {
            text: '检测企业数量',
            placeholder: '请输入检测企业数量',
            check: [
              'superviseCount',
              { rules: [{ required: true, message: '检测企业数量必须数字', pattern: new RegExp(/^[1-9]\d*$/, 'g')  },] }
            ]
        },
        warningThreshold: {
          text: '信用告警阀值',
            placeholder: '请选择信用告警阀值',
            check: [
              'warningThreshold',
              { rules: [{ required: true, message: '请选择信用告警阀值' }] }
            ]
        },
        threshold: {
            text: '阈值表达式',
            placeholder: '请输入阈值表达式',
            disabled: true,
            check: [
              'threshold',
              { rules: [{ required: false, message: '请输入阈值表达式' }] }
            ]
        },
         cycle: {
            text: '监听周期',
            placeholder: '请输入监听周期',
            disabled: false,
            check: [
              'cycle',
              // { rules: [{ required: true, message: '请输入监听周期' }] }
              {'initialValue':'',rules: [{ required: true, message: '请输入cron表达式!' }]}
            ]
        },
      },
      selectNameId: '',
      selectValue: null,
      saveSelectObj:{},
      listData: [],
      selectedRows: [],
      selectedRowKeys: [],
      currentPageData:'currentPageData',
      pagination: {
        total: 0,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '40'],
        // eslint-disable-next-line no-return-assign
        onShowSizeChange: (current, pageSize) => {
          this.queryParam.pageSize = pageSize
          this.queryParam.pageSize = current
        }
      },
      queryParam: {
        page: 1,
        currentPage: 1, // 第几页
        pageSize: 10 // 每页中显示数据的条数
      },
      
    }
  },
  computed: {  },
  mounted () {
    this.$on('show', data => {
      this.visible = true
      this.spinning =  true
      const pageType = {
        edit:'编辑',
        add:'新增'
      }
      // pageType：edit-编辑,add-新增
      this.$nextTick(()=>{
        this.initData(()=>{
          this.pageTitle =  pageType[ data.pageType ]
          this.parentDatas = data
          if( data.pageType === 'edit' ){
            this.form.resetFields({
              themeName: null,
              superviseName: null,
              status: null,
              superviseCount: null,
              warningThreshold: [],
              threshold: null,
              cycle: null
            })
              this.getNameList()
            this.form.setFieldsValue({
              themeName: JSON.parse(JSON.stringify(this.parentDatas.themeName)),
              superviseName: JSON.parse(JSON.stringify(this.parentDatas.superviseName)),
              status: JSON.parse(JSON.stringify(this.parentDatas.status)),
              superviseCount: JSON.parse(JSON.stringify(this.parentDatas.superviseCount)),
              warningThreshold: JSON.parse(JSON.stringify(this.parentDatas.warningThreshold)).split(';'),
              threshold: JSON.parse(JSON.stringify(this.parentDatas.threshold)),
              cycle: JSON.parse(JSON.stringify(this.parentDatas.cycle))
            })
            this.selectValue = this.parentDatas.mid
            this.selectNameId = this.parentDatas.mid
            this.listData = this.parentDatas.recordEntInfos
            // this.listData.map((i,k)=>{i.keysIndex = k + 1})
            if(this.parentDatas.warningThreshold){
              this.moreSelectChange(this.parentDatas.warningThreshold)
            }
          } else {
            this.form.setFieldsValue({
              themeName: null,
              superviseName: null,
              status: null,
              superviseCount: null,
              warningThreshold: [],
              threshold: null,
              cycle: null
            })
            this.getNameList()
          }
          
        })
      })
    })
  },
  methods: {
    setCorn(data){
        console.log('data)',data)
        // this.$nextTick(() => {
        //   this.model.cycle = data
        // })
    },
    initData (callBack) {
      this.pageTitle = ''
      this.selectNameId = ''
      this.selectValue = null
      this.parentDatas = {}
      this.sendForm = {}
      this.saveSelectObj= {}
      this.selectedRowKeys = []
      this.listData = []
      this.selectedRows = []
      callBack()
    },
    searchHand () {
      this.queryParam = {
        page: 1,
        currentPage: 1,
        pageSize: 10
      }
      this.fetch()
    },
   /* 新增名单 */
    addNameListHandel () {
      if(this.selectNameId){
        this.saveSelectObj.pageType = 'edit'
        this.$refs.addNameList.$emit('show',this.saveSelectObj)
      }else{
        this.$refs.addNameList.$emit('show',{pageType: 'add'})
      }
    },
    getNameList (obj = {},callBack=()=>{}) {
      this.spinning = true
      this.$xttp.creditCheckApi.getNameListFind(
        {
          body:{},
          pageSize:9999,
          page:1
        }
      ).then((res)=>{
        if(res.success){
          console.log(99999)
          this.searchList = res.body ? res.body : []
          this.spinning = false
          console.log(8888)
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
    // 重置
    reset () {
      this.sendForm = {}
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1,
        currentPage: 1, // 第几页
        pageSize: 10 // 每页中显示数据的条数
      }
      this.clearnDatas(() => {
        this.fetch()
      })
    },
    clearnDatas (callBack) {
      for (const key in this.sendForm) {
        this.sendForm[key] = null
      }
      callBack()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.currentPage = pagination.current
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetch()
      // this.selectedRowKeys = []
    },
    fetch () {
      this.loading = false
      const send = this.$filterParams(this.sendForm)
      this.queryParam.send = send
      // this.$xttp['projectApprovalApi']
      //   .AppInfoFindCondition(this.queryParam).then((res) => {
      //     this.loading = false
      //     if (res.success) {
      //       this.pagination.total = parseInt(res.total)
      //       const pagination = { ...this.pagination }
      //       pagination.pages = res.body.pages
      //       this.listData = res['body'].list
      //       this.pagination = pagination
      //       this.changePageSelectRow()
      //     } else {
      //       this.$message.warning(res.message)
      //     }
      //     // eslint-disable-next-line handle-callback-err
      //   }).catch((error) => {
      //     this.loading = false
      //   })
    },
    addSystemSuccess(list){
     this.getNameList({}, ()=>{
        if(this.selectNameId){
          this.handleChange(this.selectNameId)
        }
      })
    },
    // 保存
    handleOk () {
      this.spinning = true
      this.form.validateFields((err, value) => {
        if(!err){
          const send = {}
          Object.assign(send,this.parentDatas,value)
          send.mid = this.selectNameId
          send.superviseCount = parseInt(send.superviseCount)
          send.warningThreshold = send.warningThreshold.join(';')
          delete send.pageType
          if(this.parentDatas.pageType === 'edit'){
            this.editFunction(send)
          }else{
            this.addFunction(send)
          }
        }else{
          this.spinning = false
          this.$message.warning('请填写相关信息！')
        }
      })
    },
    addFunction (send) {
      console.log(send)
      this.$xttp.BigDateWarningSysApi.addCheckWarningList(send).then(res=>{
        if (res.success) {
          this.$emit('addSystemSuccess', this.selectedRows)
          this.$message.success('保存成功！')
          this.visible = false
          this.spinning = false
        } else {
            this.spinning = false
          this.$message.error(res.message)
        }
      }).catch((err)=>{
          this.spinning = false
        this.$message.error('网络错误，请刷新重试！')
      })
    },
    editFunction (send) {
        this.$xttp.BigDateWarningSysApi.editCheckWarningList(send).then(res=>{
          if (res.success) {
            this.$emit('addSystemSuccess', this.selectedRows)
            this.$message.success('保存成功！')
            this.visible = false
            this.spinning = false
          } else {
            this.spinning = false
            this.$message.error(res.message)
          }
        }).catch((err)=>{
            this.spinning = false
          this.$message.error('网络错误，请刷新重试！')
        })
    },
    // 返回
    handleCancel () {
      this.visible = false
    },
    /*删除 */
    deleteHandel (text,row,index) {
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除此项目？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.loading = true
          that.listData.splice(index,1)
          that.$message.success('删除成功！')
          that.loading = false
        },
        onCancel () {
        }
      })
    },
    handleBlur (value) {
    },
    handleFocus () {
      
    },
    // 选择名称后获取名单
    selectChangeGetNameList(list){
      this.listData = list
      this.form.setFieldsValue({superviseCount: this.listData.length})
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleChange(value,obj){
      if(value){
        this.selectNameId =  value
        console.log(this.selectValue)
        const saveSelect = this.searchList.find((i,k)=>{if(i.sid === value){return i}})
        this.saveSelectObj =  JSON.parse(JSON.stringify(saveSelect))
        if(saveSelect && saveSelect.creditCheckEntInfos && saveSelect.creditCheckEntInfos.length){
          this.selectChangeGetNameList(saveSelect.creditCheckEntInfos)
        }else{
          this.listData = []
          this.form.setFieldsValue({superviseCount: '0'})
        }
      }else{
        this.selectNameId =  null
         this.listData = []
        this.form.setFieldsValue({superviseCount: '0'})
      }
    },
    getChoseList (choseValue) {
      const send = {
        body: choseValue,
        page:1,
        pageSize:9999
      }
      this.$xttp.creditCheckApi.getTarkeNameChoseListApi(send).then(res => {
        if( res.success ){
          this.listData = res.body
          this.listData.map(( i, k )=>{
            i.keysIndex = k +1
            i.fieldName = i.zdmc
            i.code = i.zddm
            i.norder = k + 1
          })
           this.spinning = false
        }else{
          this.listData = []
          this.spinning = false
          this.$message.error(res.message)
        }
      }).catch((error)=>{
        this.spinning = false
        his.$message.error(`${error},网络错误请刷新重试`)
      })
    },
    moreSelectChange (value) {
      if(value.indexOf('1') !== -1){
        this.formLable.threshold.check[1].rules[0].required = true
        this.formLable.threshold.disabled = false
      } else {
        this.formLable.threshold.check[1].rules[0].required = false
        this.formLable.threshold.disabled = true
      } 
    },
    // 监听周期-点击选择
    slectCron () {
      this.$refs.selectCrons.$emit('show')
    }
  }
}
</script>
<style lang="less" scoped>
.c-plus-icon{
    color:red;
    margin: 0 auto;
    font-size:22px;
    display:block;
}
.ant-table-footer::after{
    margin: 0 auto;
}
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
