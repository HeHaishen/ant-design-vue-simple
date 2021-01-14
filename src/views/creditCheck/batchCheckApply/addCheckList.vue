<!--
 * @Description: 信用核查-新增名单
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 19:27:59
 * @LastEditTime: 2021-01-12 17:18:51
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
    <a-form :form="form" class="form">
      <a-row class="form-row" :gutter="16">
        <a-col :xl="{span: 7, offset: 1}" :lg="6" :md="12" :sm="24">
          <a-form-item
            :label="formLable.name.text">
            <a-input
              allowClear
              :maxLength="formLable.name.maxLength"
              :placeholder="formLable.name.placeholder"
              v-decorator="formLable.name.check" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
          <a-form-item
            :label="formLable.orgName.text">
            <a-input
              allowClear
              :maxLength="formLable.orgName.maxLength"
              :placeholder="formLable.orgName.placeholder"
              v-decorator="formLable.orgName.check" />
          </a-form-item>
        </a-col>
        <a-col :xl="{span: 7, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
          <a-form-item
            class="date-picker-noline"
            :label="formLable.lastUpdatedBy.text">
            <a-date-picker
              allowClear
              :locale="'locale'"
              :placeholder="formLable.lastUpdatedBy.placeholder"
              v-decorator="formLable.lastUpdatedBy.check" />
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
      <template slot="operation" slot-scope="text, record, index">
        <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button>
      </template>
      <template slot="footer" :slot-scope="currentPageData" class="c-tablebottom">
        <a-icon type="plus-circle" @click="plusNameList" class="c-plus-icon" />
      </template>
    </a-table>
    <addCheckListSelect ref="addCheckListSelect" @addSystemSuccess="addSystemSuccess" />
    <!-- </template>
    </CContent> -->
  </a-modal>
</template>
<script>
import moment from 'moment'
import addCheckListSelect from './addCheckListSelect'
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
    },
     {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 40
    }
]
export default {
    components: { addCheckListSelect },
  data () {
    return {
      pageTitle: '',
      parentDatas: {},
      form: this.$form.createForm(this),
      columns,
      confirmLoading: false,
      visible: false,
      loading: false,
    /*   sendForm: {
        orgName: null, // string 机构名称
        sysName: null, //	string 应用系统名称
        sysType: null, //	string 应用系统类别 （1软件应用系统 2硬件应用系统 3软硬件集成应用系统 4基础支撑系统）
        serverInfo: null //	string 服务对象
      }, */
       formLable: {
        name: {
          text: '名单名称',
          placeholder: '请输入名单名称',
          maxLength:200,
          check: [
            'name',
            { rules: [{ required: true, message: '请输入名单名称' }] }
          ]
        },
        orgName: {
          text: '发文机关',
              placeholder: '请输入发文机关',
              maxLength:200,
              check: [
                'orgName',
              { rules: [{ required: false, message: '请输入发文机关' }] }
              ]
        },
        lastUpdatedBy: {
          text: '发文日期',
            placeholder: '请输入发文日期',
            check: [
              'lastUpdatedBy',
              { rules: [{ required: false, message: '请输入发文日期' }] }
            ]
        },
        // CheckUse: {
        //     text: '有效期',
        //     placeholder: '请输入有效期',
        //     check: [
        //       'CheckUse',
        //       { rules: [{ required: true, message: '请输入有效期' }] }
        //     ]
        // }
      },
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
        currentPage: 1, // 第几页
        pageSize: 10 // 每页中显示数据的条数
      }
    }
  },
  computed: {},
  mounted () {
    this.$on('show', data => {
      this.visible = true
      const pageType = {
        edit:'编辑检查名单',
        add:'新增检查名单'
      }
      // pageType：edit-编辑,add-新增
      this.$nextTick(()=>{
        this.initData(()=>{
          this.pageTitle =  pageType[ data.pageType ]
          this.parentDatas = data
          if( data.pageType === 'edit' ){
            this.listData = this.parentDatas.creditCheckEntInfos
            this.listData.map( async (i, k)=>{
              this.listData[k].qymc = i.entName
              this.listData[k].tyshxydm = i.idcode
              this.listData[k].fddbr  = i.legalPerson
            })
            this.form.resetFields({
              name: null,
              orgName: null,
              lastUpdatedBy: null
            })
            this.form.setFieldsValue({
              name: JSON.parse(JSON.stringify(this.parentDatas.name)),
              orgName: JSON.parse(JSON.stringify(this.parentDatas.orgName)),
              lastUpdatedBy: JSON.parse(JSON.stringify(this.parentDatas.lastUpdatedBy))
            })
          } else {
           this.form.setFieldsValue({
              name: null,
              orgName: null,
              lastUpdatedBy: null
            })
          }
          
        })
      })
    })
  },
  methods: {
    initData (callBack) {
      this.pageTitle = ''
      this.parentDatas = {}
      this.selectedRowKeys = []
      this.listData = []
      this.selectedRows = []
      callBack()
    },
    searchHand () {
      this.queryParam = {
        currentPage: 1,
        pageSize: 10
      }
      this.fetch()
    },
    // 重置
    reset () {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
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
      this.queryParam.pageSize = pagination.pageSize
      this.fetch()
      // this.selectedRowKeys = []
    },
    fetch () {
      this.loading = false
      const send = this.$filterParams(this.sendForm)
      this.queryParam.send = send
    //   this.$xttp['projectApprovalApi']
    //     .AppInfoFindCondition(this.queryParam).then((res) => {
    //       this.loading = false
    //       if (res.success) {
    //         this.pagination.total = parseInt(res.total)
    //         const pagination = { ...this.pagination }
    //         pagination.pages = res.body.pages
    //         this.listData = res['body'].list
    //         this.pagination = pagination
    //         this.changePageSelectRow()
    //       } else {
    //         this.$message.warning(res.message)
    //       }
    //       // eslint-disable-next-line handle-callback-err
    //     }).catch((error) => {
    //       this.loading = false
    //     })
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
      this.loading = true
      this.form.validateFields((err, value) => {
        if(!err){
          const send = {}
          Object.assign(send,this.parentDatas,value)
         send.lastUpdatedBy =  send.lastUpdatedBy ? moment(send.lastUpdatedBy).format('YYYY-MM-DD') : null
          console.log(send)
          send.creditCheckEntInfos = JSON.parse(JSON.stringify(this.listData))
          if(this.parentDatas.pageType === 'edit'){
            this.editFunction(send)
          }else{
            this.addFunction(send)
          }

        }else{
          this.loading = false
          this.$message.warning('请填写相关信息！')
        }
      })
      // const send = {
      //   creditCheckEntInfos:this.listData
      // }
      // console.log(this.selectedRows)
      // this.$emit('addSystemSuccess', this.selectedRows)
      // this.visible = false
    //   this.selectedRowKeys.map((item, index) => {
    //       this.listData.find((i)=>)
    //   })
    },
    addFunction (send) {
      this.$xttp.creditCheckApi.addNameList(send).then(res=>{
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
        this.$xttp.creditCheckApi.editNameList(send).then(res=>{
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
          // if(row.sid){
          //   that.$xttp.creditCheck.deleteNameList({body: [sid] }).then(res => {
          //     that.loading = false
          //     if (res.success) {
          //       that.$message.success('删除成功！')
          //       that.listData.splice(index,1)
          //     } else {
          //       console.log('删除请求失败！', res.message)
          //       that.$message.error('删除请求失败！' + res.message)
          //     }
          //   })
          //     .catch(error => {
          //       if (error) {
          //         that.$message.error('删除失败！')
          //       }
          //     })
          // }else{
          //   that.$message.success('删除成功！')
          //   that.listData.splice(index,1)
          //   that.loading = false
          // }
        },
        onCancel () {
        }
      })
    },
    /* 点击+号 */
    plusNameList () {
     
      console.log(this.listData)
      this.$refs.addCheckListSelect.$emit('show',this.listData)
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
