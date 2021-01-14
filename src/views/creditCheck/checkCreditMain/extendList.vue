<!--
 * @Description: 信用核查-新增名单
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 19:27:59
 * @LastEditTime: 2021-01-07 18:05:47
-->
<template>
  <div style="border:2px #ddd solid;padding:4px;background:#f1fbff;">
    <a-form layout="inline" :form="sendForm">
      <a-form-item label="">
        <a-input allowClear v-model.trim="sendForm.qymc" placeholder="企业名称" />
      </a-form-item>
      <a-form-item label="">
        <a-input allowClear v-model.trim="sendForm.tyshxydm" placeholder="统一社会信用代码" />
      </a-form-item>
      <a-form-item label="">
        <a-input allowClear v-model.trim="sendForm.fddbr" placeholder="企业法人" />
      </a-form-item>
      <a-form-item class="c-lineform-data">
        <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
      </a-form-item>
      <a-form-item class="c-lineform-data">
        <a-button icon="sync" @click="reset">重置</a-button>
      </a-form-item>
    </a-form>
    <a-table
      width="100%"
      :columns="columns"
      :dataSource="listDatas"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :rowKey="(record, index) => index"
    >
      <template slot="status" slot-scope="text, record">
        <span
          class="c-status-style" 
          :class="{
            'c-status-blue':text==='1',
            'c-status-cyan':text==='2',
            'c-status-green':text==='3',
            'c-status-red':text==='4',
            'c-status-yello':text==='5'
          }"
        ></span>
        {{ statusObjShow[record.status] }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <!-- <a-button size="small" type="link" @click="detailHandel(text,record,index)">查看</a-button> -->
        <a-button v-if="record.status && (record.status === '3' || record.status === '4')" type="link" @click="checkReport(text,record,index)">核查报告</a-button>
      </template>
    </a-table>
    <showReport ref="showReport" />
    <addEditDetail ref="addEditDetail" />
  </div>
</template>
<script>
import addEditDetail from './detail'
import showReport from './showReport'
const columns = [
   {
        title: '企业名称',
        dataIndex: 'qymc',
        width: 200
    },
    {
        title: '统一社会信用代码',
        dataIndex: 'tyshxydm',
        width: 120
    },
    {
        title: '企业法人',
        dataIndex: 'fddbr',
        width: 100
    },
    {
        title: '状态',
        dataIndex: 'status',
         scopedSlots: { customRender: 'status' },
        width: 100
    },
     {
        title: '操作',
        dataIndex: 'operation',
         scopedSlots: { customRender: 'operation' },
        width: 100
    },
]
export default {
   components: { showReport, addEditDetail },
  data () {
    return {
      columns,
      loading: false,
      sendForm: {
        qymc: null, // string 机构名称
        tyshxydm: null, //	string 应用系统名称
        fddbr: null, //	string 应用系统类别 （1软件应用系统 2硬件应用系统 3软硬件集成应用系统 4基础支撑系统）
      },
      statusObjShow: {
        1:'未开始',
        2:'核查中',
        3:'核查完成',
        4:'核查告警',
        5:'核查失败'
      },
      listDatas: [],
      parentDatas: [],
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
        page: 1, // 第几页
        pageSize: 10 // 每页中显示数据的条数
      }
    }
  },
  props: {
    parentRowDatas: {
      type: Object,
      default: () =>{return {}} ,
      required: true
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    initData () {
      console.log(777)
      this.parentDatas = []
      this.listData = []
      this.fetch()
    },
    searchHand () {
      this.queryParam = {
        page: 1,
        pageSize: 10
      }
      this.fetch()
    },
    // 重置
    reset () {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1, // 第几页
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
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetch()
    },
    fetch () {
      this.loading = true
      const send = this.$filterParams(this.sendForm)
      send.applyId =  this.parentRowDatas.sid
      this.queryParam.body = send
      this.$xttp.creditCheckApi.getCreditMainExtendList(
        this.queryParam
      ).then((res)=>{
        if(res.success){
          this.loading = false
          this.choseValue = null
          this.pagination.total = parseInt(res.total)
          const pagination = { ...this.pagination }
          pagination.pages = res.page
          this.listDatas = res.body ? res.body : []
          this.pagination = pagination
        }else{
          this.listDatas =  []
          this.loading = false
        }
      }).catch((error)=>{
        if(error){
          this.loading = false
        }
      })
    },
    // 保存
    handleOk () {
      console.log(this.selectedRows)
      const list = JSON.parse(JSON.stringify(this.selectedRows))
      this.$emit('addSystemSuccess', list)
      this.visible = false
    },
    /*删除 */
    deleteHandel (text,row,index) {
        
    },
    /* 查看详情 */
    detailHandel (text,record,index){
      const datas = JSON.parse(JSON.stringify( record ))
      datas.pageType = 'detail'
      this.$refs.addEditDetail.$emit('show', datas )
      // this.$message.warning('此功能暂未开放')
    },
    checkReport (text, record, index) {
      this.loading = true
      this.$xttp.creditCheckApi.getCheckApplyReport(record).then(res=>{
        this.loading = false
        if(res && res.success === false){
          this.$message.error(res.message)
        } else if(!res){
          this.$message.error('无法获取报告！')
        } else {
          this.$refs.showReport.$emit('show',res)
        }
      }).catch((error)=>{
        if(error){
          this.loading = false
          this.$message.error('网络错误，请刷新重试！')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
