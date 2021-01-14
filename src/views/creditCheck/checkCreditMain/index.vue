<!--
 * @Description: 信用核查-信用主体
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-07 18:04:10
-->
<template>
  <CContent>
    <template v-slot:contentinlineForm>
      <a-form layout="inline" :form="sendForm" class="c-list-form">
        <a-form-item label="申请时间" class="c-lineform-data">
          <a-range-picker :placeholder="['开始日期', '结束日期']" v-model.trim="datasArr">
          </a-range-picker>
        </a-form-item>
        <a-form-item label="状态" class="c-lineform-data">
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.status">
            <a-select-option value="1">未开始</a-select-option>
            <a-select-option value="2">核查中</a-select-option>
            <a-select-option value="3">核查完成</a-select-option>
            <a-select-option value="4">核查告警</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="申请单位" >
          <a-input
            allowClear
            v-model.trim="sendForm.orgName"
          />
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </template>
    <template v-slot:contentDetail>
      <a-table
        :ellipsis="true"
        :columns="columns"
        :dataSource="listData"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        @expand="expandHandel"
        :rowKey="(record, index) => index"
      >
        <!-- :scroll="pageTableY?{ x: 2000,y: mixinsetTableY }:{x: 2000}" -->
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
        <template slot="expandedRowRender" slot-scope="row">
          <extendList :parentRowDatas="row" ref="extendList" />
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-button size="small" type="link" @click="detailHandel(text,record,index)">查看</a-button>
          <a-button v-if="record.status && (record.status === '3' || record.status === '4')" type="link" @click="checkReport(text,record,index)">核查报告</a-button>
        </template>
      </a-table>
      <showReport ref="showReport" />
      <addEditDetail ref="addEditDetail" />
    </template>
  </CContent>
</template>
<script>
import addEditDetail from './detail'
import moment from 'moment'
import showReport from './showReport'
import extendList from './extendList'
const columns = [
    {
        title: '申请单位',
        dataIndex: 'orgName',
        width: 100
    },
    {
        title: '申请人',
        dataIndex: 'applicant',
        width: 200
    },
    {
        title: '状态',
        dataIndex: 'status',
         scopedSlots: { customRender: 'status' },
        width: 100
    },
    {
        title: '申请时间',
        dataIndex: 'created',
        width: 200
    },
    {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 160
    }
]
export default {
    components: { showReport, addEditDetail, extendList },
  data () {
      return {
        sendForm: {
          orgName: null, //	项目名称
          status: null, //	经办人
          startDate: null,
          endDate: null
        },
        statusObjShow: {
          1:'未开始',
          2:'核查中',
          3:'核查完成',
          4:'核查告警',
          5:'核查失败'
        },
        datasArr: [],
        listData: [],
        loading: false,
        columns,
        pagination: { 
          total: 0,
          defaultPageSize: 10,
          showTotal: total => `共 ${total} 条数据`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '40'],
          onShowSizeChange: (current, pageSize) => this.pageSize = pageSize
        },
        queryParam: {
          page: 1, // 第几页
          pageSize: 10 // 每页中显示数据的条数
        },
        listLoading:false
      }
  },
  created () {
    this.fetch()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    // 重置
    reset () {
      this.clearnDatas(() => { this.fetch() })
    },
     // 查询
    searchHand () {
      this.queryParam = {
        page: 1,
        pageSize: 10
      }
      this.fetch()
    },
    clearnDatas (callBack) {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        page: 1, // 第几页
        pageSize: 10 // 每页中显示数据的条数
      }
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
      if(this.datasArr.length){
        this.sendForm.startDate = moment(this.datasArr[0]).format('YYYY-MM-DD hh:mm:ss')
        this.sendForm.endDate = moment(this.datasArr[1]).format('YYYY-MM-DD hh:mm:ss')
      }
      const send = this.$filterParams(this.sendForm)
      this.queryParam.body = send
      this.$xttp.creditCheckApi.getCheckApplyList(this.queryParam).then((res) => {
        this.loading = false
        if (res.success) {
          this.pagination.total = parseInt(res.total)
          const pagination = { ...this.pagination }
          pagination.pages = res.pages
          this.listData = res['body']
          this.listData.map(async (item, index) => {
            // item.INDEX = (res.body.pageNum - 1) * res.body.pageSize + index + 1
          })
          this.pagination = pagination
        } else {
          this.$message.error('获取列表失败！' + res.message)
        }
      }).catch((error) => {
        console.error('获取列表失败！' + error)
        this.$message.error('获取列表失败！')
        this.loading = false
      })
    },
     /* 删除 */
    deleteHandel (text, record, index) {
       const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除此？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.loading = true
          // that.$xttp.acceptanceApi.implementChildDelete({ sid }).then(res => {
          //   that.loading = false
          //   if (res.success) {
          //     that.$message.success('删除成功！')
          //   } else {
          //     console.log('删除请求失败！', res.message)
          //     that.$message.error('删除请求失败！' + res.message)
          //   }
          // })
          //   .catch(error => {
          //     if (error) {
          //       that.$message.error('删除失败！')
          //     }
          //   })
        },
        onCancel () {
        }
      })
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
    },
    expandedRowsChange (expandedRows, text) {
      console.log(expandedRows, text)
      // this.listData[]
    },
    expandHandel (type, expandedRows) {
      // console.log(expandedRows, text)
      if ( type ) {
        this.$nextTick(()=>{
          console.log(expandedRows,this.$refs)
          this.$refs.extendList.initData()
        })
      }
    },
    getExpandList (row) {
      this.loading = true
      console.log(row,this.$refs.extendList)
      this.$refs.extendList.initData()
    }
  }
}
</script>

