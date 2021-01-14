<!--
 * @Description: 大数据预警分析系统-预警信息应用
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-07 09:44:46
-->
<template>
  <CContent>
    <template v-slot:contentinlineForm>
      <a-form layout="inline" :form="sendForm" class="c-list-form">
        <a-form-item label="预警主题" >
          <a-input
            allowClear
            v-model.trim="sendForm.themeName"
          />
        </a-form-item>
        <a-form-item label="预警企业" >
          <a-input
            allowClear
            v-model.trim="sendForm.entName"
          />
        </a-form-item>
        <a-form-item label="受理单位">
          <a-input
            allowClear
            v-model.trim="sendForm.superviseName"
          />
        </a-form-item>
        <a-form-item label="状态" class="c-lineform-data">
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.status">
            <a-select-option value="1">使用</a-select-option>
            <a-select-option value="2">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="export" @click="reset">导出</a-button>
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
        <template slot="operation" slot-scope="text, record, index">
          <a-button size="small" type="link" @click="detailHandel(text,record,index)">查看</a-button>
          <!-- <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button> -->
        </template>
      </a-table>
    </template>
  </CContent>
</template>
<script>
const columns = [
    {
        title: '信用预警主题',
        dataIndex: 'themeName',
        width: 150
    },
    {
        title: '预警企业',
        dataIndex: 'entName',
        width: 150
    },
    {
        title: '预警事由',
        dataIndex: 'reason',
        width: 200
    },
    {
        title: '受理单位',
        dataIndex: 'superviseName',
        width: 100
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 80
    },
    {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 120
    }
]
export default {
    components: { },
  data () {
      return {
        sendForm: {
          projectName: null, //	项目名称
          agentorName: null //	经办人
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
          page:1,
          currentPage: 1, // 第几页
          pageSize: 10 // 每页中显示数据的条数
        }
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
        currentPage: 1,
        pageSize: 10
      }
      this.fetch()
    },
    clearnDatas (callBack) {
      this.pagination.current = 1
      this.pagination.pageSize = 10
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
      const send = this.$filterParams(this.sendForm)
      this.queryParam.body = send
        this.$xttp.BigDateWarningSysApi.warningInfoList(this.queryParam).then((res) => {
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
      this.$message.warning('此功能暂未开放')
    }
  }
}
</script>

