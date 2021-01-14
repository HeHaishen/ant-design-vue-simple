<!--
 * @Description: 信用核查-核查申请
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-08 17:07:54
-->
<template>
  <CContent>
    <template v-slot:contentinlineForm>
      <a-form layout="inline" :form="sendForm" class="c-list-form">
        <a-form-item label="创建时间" class="c-lineform-data">
          <a-range-picker v-model.trim="startEndTime">
          </a-range-picker>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="export" @click="exportHandel">导出</a-button>
        </a-form-item>
      </a-form>
    </template>
    <template v-slot:contentDetail>
      <div class="c-statistics-title">双公示上报统计</div>
      <p style="height:20px;font-size:15px;margin:12px 20px;font-weight:bold;" v-if="startEndTime && startEndTime.length">
        统计时间：<span style="color:#2985ff;font-weight:normal;">{{ moment(startEndTime[0]).format('YYYY-MM-DD') }} 至 {{ moment(startEndTime[1]).format('YYYY-MM-DD') }}</span>
      </p>
      <a-table
        :ellipsis="true"
        :columns="columns"
        :dataSource="listData"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        :rowKey="(record, index) => index"
      >
        <!-- :scroll="pageTableY?{ x: 2000,y: mixinsetTableY }:{x: 2000}" -->
        <template slot="operation" slot-scope="text, record, index">
          <a-button size="small" type="link" @click="(text,record,index)=>detailHandel(text,record,index)">编辑</a-button>
          <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button>
        </template>
      </a-table>
    </template>
  </CContent>
</template>
<script>
import moment from 'moment'
const columns = [
    {
        title: '单位编号',
        dataIndex: 'dwbh',
        width: 240
    },
    {
        title: '单位名称',
        dataIndex: 'orgName',
        width: 200
    },
    {
        title: '行政许可上传数据量',
        dataIndex: 'xkUploadNum',
        width: 200
    },
    {
        title: '行政处罚上传数据量',
        dataIndex: 'cfUploadNum',
        width: 200
    },
    {
        title: '上传数据合计',
        dataIndex: 'uploadNum',
        width: 100
    },
    {
        title: '累计上传数据量',
        dataIndex: 'cumulative',
        width: 200
    }
]
export default {
    components: { },
  data () {
      return {
        startEndTime:[],
        sendForm: {
          startDate: null, //	项目名称
          endDate: null //	经办人
        },
        loading: false,
        columns,
        listData: [],
        pagination: { 
          total: 0,
          defaultPageSize: 10,
          showTotal: total => `共 ${total} 条数据`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '40'],
          onShowSizeChange: (current, pageSize) => this.pageSize = pageSize
        },
        queryParam: {
           page: 1,
          currentPage: 1, // 第几页
          pageSize: 10 // 每页中显示数据的条数
        }
      }
  },
  created () {
    const nowYear = new Date().getFullYear()
    this.startEndTime = [
      `${nowYear}-01-01 00:00:01`,
      `${nowYear}-12-31 23:59:59`
    ]
    this.fetch()
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    moment,
    // 重置
    reset () {
      this.clearnDatas(() => { this.fetch() })
    },
     // 查询
    searchHand () {
      this.queryParam = {
         page: 1,
        currentPage: 1,
        pageSize: 10
      }
      this.fetch()
    },
     exportHandel () {
       this.loading = true
      if(this.startEndTime && this.startEndTime.length){
        this.sendForm.startDate = moment(this.startEndTime[0]).format('YYYY-MM-DD')// format('YYYY-MM-DD hh:mm:ss')
        this.sendForm.endDate = moment(this.startEndTime[1]).format('YYYY-MM-DD')
      }
      const send = this.$filterParams(this.sendForm)
      // send.applyType = '2'
      this.queryParam.body = send
      const that = this
      this.$exportHandel({url:'/merits-server/credit/sgsCount/export',data: this.queryParam},()=>{
        that.loading = false
      })
    },
    clearnDatas (callBack) {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      const nowYear = new Date().getFullYear()
      this.startEndTime = [
        `${nowYear}-01-01 00:00:01`,
        `${nowYear}-12-31 23:59:59`
      ]
      this.queryParam = {
        page: 1,
        currentPage: 1, // 第几页
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
      this.queryParam.currentPage = pagination.current
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetch()
    },
    fetch () {
      this.loading = true
      if(this.startEndTime && this.startEndTime.length){
        this.sendForm.startDate = moment(this.startEndTime[0]).format('YYYY-MM-DD')// format('YYYY-MM-DD hh:mm:ss')
        this.sendForm.endDate = moment(this.startEndTime[1]).format('YYYY-MM-DD')
      }
      const send = this.$filterParams(this.sendForm)
      this.queryParam.body = send
        this.$xttp.InfoPerformanceSupervisionApi.formulaReportList(this.queryParam).then((res) => {
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
            // this.$nextTick(() => {
            //   this.getSetClintHeight()
            // })
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
    detailHandel (text,record,index){}
  }
}
</script>
