<!--
 * @Description: 信用核查-新增名单
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 19:27:59
 * @LastEditTime: 2021-01-12 17:37:33
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
              class="c-lineform-data"
              :label="formLable.tableName.text">
              <!-- <a-input
                    allowClear
                    :maxLength="formLable.name.maxLength"
                    :placeholder="formLable.name.placeholder"
                    v-decorator="formLable.name.check" /> -->
              <a-select
                allowClear
                class="c-float-bottom"
                show-search
                option-filter-prop="children"
                style="width: 200px"
                :filter-option="filterOption"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="selectChange"
                :placeholder="formLable.tableName.placeholder"
                v-decorator="formLable.tableName.check"
              >
                <a-select-option v-for="(item) in tagerSlectLsit" :key="item.bmc" :value="item.bmc">
                  {{ item.xxsxmc }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
            <a-form-item
              :label="formLable.tableCode.text">
              <a-input
                disabled
                allowClear
                :maxLength="formLable.tableCode.maxLength"
                v-decorator="formLable.tableCode.check" />
            </a-form-item>
          </a-col>
          <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
            <a-form-item
              class="c-lineform-data"
              :label="formLable.status.text">
              <!-- <a-date-picker
                    allowClear
                    :locale="'locale'"
                    :placeholder="formLable.lastUpdatedBy.placeholder"
                    v-decorator="formLable.lastUpdatedBy.check" /> -->
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
              class="c-lineform-data"
              :label="formLable.type.text">
              <a-select
                allowClear
                :maxLength="formLable.type.maxLength"
                :placeholder="formLable.type.placeholder"
                v-decorator="formLable.type.check">
                <a-select-option value="1">守信</a-select-option>
                <a-select-option value="2">失信</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
    </a-spin>
    <!-- </template>
    </CContent> -->
  </a-modal>
</template>
<script>
import moment from 'moment'
const columns = [
   {
        title: '序号',
        dataIndex: 'keysIndex',
        width: 60
    },
    {
        title: '字段名称',
        dataIndex: 'fieldName',
        width: 120
    },
    {
        title: '字段代码',
        dataIndex: 'code',
        width: 100
    },
    {
        title: '显示顺序',
        dataIndex: 'norder',
        width: 100,
         scopedSlots: { customRender: 'norder' },
    },
     {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 40
    }
]
export default {
  data () {
    return {
      pageTitle: '',
      parentDatas: {},
      sendForm:{},
      tagerSlectLsit:[],
      form: this.$form.createForm(this),
      columns,
      confirmLoading: false,
      visible: false,
      spinning:false,
      loading: false,
      formLable: {
        tableName: {
          text: '指标名称',
          placeholder: '请选择指标名称',
          maxLength:200,
          check: [
            'tableName',
            { rules: [{ required: true, message: '请选择指标名称' }] }
          ]
        },
        tableCode: {
          text: '指标英文名',
              placeholder: '请输入指标英文名',
              maxLength:200,
              check: [
                'tableCode',
              { rules: [{ required: true, message: '请输入指标英文名' }] }
              ]
        },
        status: {
          text: '状态',
            placeholder: '请选择状态',
            check: [
              'status',
              { rules: [{ required: true, message: '请选择状态' }] }
            ]
        },
        type: {
            text: '信用类型',
            placeholder: '请选择信用类型',
            check: [
              'type',
              { rules: [{ required: true, message: '请选择信用类型' }] }
            ]
        }
      },
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
  computed: {},
  mounted () {
    this.$on('show', data => {
      this.visible = true
      this.spinning =  true
      const pageType = {
        'edit':'编辑',
        'detai':'详情',
        'add':'新增'
      }
      // pageType：edit-编辑,add-新增
      this.$nextTick(()=>{
        this.initData(()=>{
          console.log(data.pageType)
          this.pageTitle =  pageType[ data.pageType ]
          console.log(pageType, pageType[data.pageType + ''])
          this.parentDatas = data
          if( data.pageType === 'edit' ){
            this.form.resetFields({
              tableName: null,
              tableCode: null,
              status: null,
              type: null
            })
            this.getTakeNameList()
            this.form.setFieldsValue({
              tableName: JSON.parse(JSON.stringify(this.parentDatas.tableName)),
              tableCode: JSON.parse(JSON.stringify(this.parentDatas.tableCode)),
              status: JSON.parse(JSON.stringify(this.parentDatas.status)),
              type: JSON.parse(JSON.stringify(this.parentDatas.type))
            })
            this.listData = this.parentDatas.fields
            this.listData.map((i,k)=>{i.keysIndex = k + 1})
          } else {
            this.form.setFieldsValue({
              tableName: null,
              tableCode: null,
              status: null,
              type: null
            })
            this.getTakeNameList()
          }
          
        })
      })
    })
  },
  methods: {
    initData (callBack) {
      this.pageTitle = ''
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
    getTakeNameList () {
      this.$xttp.creditCheckApi.getTakeNameListApi({
        page:1,
        pageSize:9999,
        body:{}
      }).then(res=>{
       
        this.tagerSlectLsit = []
        if(res.success){
          this.tagerSlectLsit =  res.body
          console.log(res)
          console.log(this.spinning)
           this.spinning = false
        } else {
          this.$message.error(res.message)
           this.spinning = false
        }
      }).catch((error)=>{
        this.spinning = false
        this.$message.error(error+',网络错误，请刷新重试！')
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
    // 勾选
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      // this.selectedRows.push(...selectedRows)
      // this.selectedRows = Array.from(new Set(this.selectedRows))
      this.hadChange = true
    },
    // 点击所有的回调
    onSelectAll (selected, selectedRows, changeRows) {
      console.log(123, selected, selectedRows, changeRows)
      if (!selected) {
        this.selectedRows = []
      } else {
        this.selectedRows.push(...selectedRows)
        this.selectedRows = Array.from(new Set(this.selectedRows))
      }
    },
    // 取消或勾选的回调
    onSelectTable (record, selected, selectedRows) {
      if (selected) {
        this.selectedRows.push(...selectedRows)
        this.selectedRows = Array.from(new Set(this.selectedRows))
      } else {
        this.selectedRows.map(async (i, k) => {
          if (record.sid === i.sid) {
            this.selectedRows.splice(k, 1)
          }
        })
      }
    },
    changePageSelectRow () {
      this.selectedRowKeys = []
      if (this.selectedRows.length && this.listData.length) {
        this.selectedRows.map((item, index) => {
          this.listData.map((i, v) => {
            if (item.sid === i.sid) {
              this.selectedRowKeys.push(v)
            }
          })
        })
      }
    },
    addSystemSuccess(list){
      list.map(async (i,k)=>{
        list[k].entName = i.qymc
        list[k].idcode = i.tyshxydm
        list[k].legalPerson = i.fddbr
      })
      this.listData = this.listData.concat(list)
    },
    // 保存
    handleOk () {
      this.spinning = true
      this.form.validateFields((err, value) => {
        if(!err){
          const send = {}
          Object.assign(send,this.parentDatas,value)
          send.tableName =  this.saveSelectObj.xxsxmc
          send.fields = JSON.parse(JSON.stringify(this.listData))
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
      this.$xttp.creditCheckApi.addListTargetApi(send).then(res=>{
        if (res.success) {
          this.$emit('addSystemSuccess', this.selectedRows)
          this.$message.success('保存成功！')
          this.visible = false
          this.loading = false
        } else {
            this.loading = false
          this.$message.error(res.message)
        }
      }).catch((err)=>{
          this.loading = false
        this.$message.error('网络错误，请刷新重试！')
      })
    },
    editFunction (send) {
        this.$xttp.creditCheckApi.editListTargetApi(send).then(res=>{
          if (res.success) {
            this.$emit('addSystemSuccess', this.selectedRows)
            this.$message.success('保存成功！')
            this.visible = false
            this.loading = false
          } else {
              this.loading = false
            this.$message.error(res.message)
          }
        }).catch((err)=>{
            this.loading = false
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
    /* 点击+号 */
    plusNameList () {
      console.log(this.listData)
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
    selectChange(value,obj){
      if(value){
        this.spinning = true
        this.saveSelectObj = this.tagerSlectLsit.find((i,k)=>{if( i.bmc === value){return i}})
        this.form.setFieldsValue({ tableCode: this.saveSelectObj.bmc })
        this.getChoseList({ bmc: this.saveSelectObj.bmc })
      }else{
        this.saveSelectObj = {}
        this.form.setFieldsValue({ bmc: null })
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

</style>
