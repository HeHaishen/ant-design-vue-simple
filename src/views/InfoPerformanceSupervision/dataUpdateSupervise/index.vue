<!--
 * @Description: 信息督查绩效监管-数据更新督办
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-05 16:59:00
-->
<template>
  <CContent>
    <template v-slot:contentinlineForm>
      <a-form layout="inline" :form="sendForm" class="c-list-form">
        <a-form-item label="督办时间" class="c-lineform-data">
          <a-range-picker v-model.trim="sendForm.startEndTime">
          </a-range-picker>
        </a-form-item>
        <a-form-item label="逾期情况" class="c-lineform-data" v-if="false">
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.unitType">
            <a-select-option value="1">是</a-select-option>
            <a-select-option value="0">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="责任单位">
          <a-input
            allowClear
            placeholder="责任单位"
            v-model.trim="sendForm.orgName"
          />
        </a-form-item>
        <a-form-item label="办理状态" class="c-lineform-data">
          <a-select allowClear style="width: 200px" v-model="sendForm.handleType">
            <a-select-option value="0">待督办</a-select-option>
            <a-select-option value="1">督办立项</a-select-option>
            <a-select-option value="2">反馈办理情况</a-select-option>
            <a-select-option value="3">督办通报</a-select-option>
            <a-select-option value="4">督办事项完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
        </a-form-item>
        
        <a-form-item class="c-lineform-data">
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="export" @click="reset">导出</a-button>
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
        :rowKey="(record, index) => index"
      >
        <!-- :scroll="pageTableY?{ x: 2000,y: mixinsetTableY }:{x: 2000}" -->
        <template slot="handleType" slot-scope="text">
          {{ handleTypeShowObj[text] }}
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-button size="small" type="link" @click="(text,record,index)=>detailHandel(text,record,index)">查看</a-button>
          <a-button type="link" @click="deleteHandel(text,record,index)">创建督办任务</a-button>
          <a-button type="link" @click="deleteHandel(text,record,index)">办理</a-button>
        </template>
      </a-table>
    </template>
  </CContent>
</template>
<script>
import moment from 'moment'
const columns = [
    {
        title: '责任单位',
        dataIndex: 'orgName',
        width: 160
    },
    {
        title: '主题',
        dataIndex: 'themeName',
        width: 140
    },
    {
        title: '更新周期',
        dataIndex: 'updateCycle',
        width: 100
    },
    {
        title: '逾期时间',
        dataIndex: 'overdueTime',
        width: 100
    },
    {
        title: '状态',
        dataIndex: 'handleType',
        width: 100
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 100
    }
]
export default {
    components: { },
  data () {
      return {
        startEndTime:[],
        sendForm: {
          orgName: null, //	项目名称
          handleType: null //	经办人
        },
        handleTypeShowObj:{
          '0':'待督办',
          '1':'督办立项',
          '2':'反馈办理情况',
          '3':'督办通报',
          '4':'督办事项完成'
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
          currentPage: 1, // 第几页
          pageSize: 10 // 每页中显示数据的条数
        }
      }
  },
  created () {
    // const nowYear = new Date().getFullYear()
    // this.startEndTime = [
    //   `${nowYear}-01-01 00:00:01`,
    //   `${nowYear}-12-31 23:59:59`
    // ]
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
    clearnDatas (callBack) {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.startEndTime = []
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
       this.loading = false
      const send = this.$filterParams(this.sendForm)
      if(this.startEndTime && this.startEndTime.length){
       send.startDate = moment(this.startEndTime[0]).format('YYYY-MM-DD')// format('YYYY-MM-DD hh:mm:ss')
       send.endDate = moment(this.startEndTime[1]).format('YYYY-MM-DD')
      }
      send.meusType = '2'
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
