<!--
 * @Description: 大数据预警分析系统-企业信用监测预警
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-05 15:35:31
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
        <a-form-item label="状态" class="c-lineform-data">
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.status">
            <a-select-option value="1">使用</a-select-option>
            <a-select-option value="2">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="监管部门">
          <a-input
            allowClear
            v-model.trim="sendForm.superviseName"
          />
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="plus" @click="addHandel" type="primary">新增</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="export" @click="exportHandel">导出</a-button>
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
        <template slot="status" slot-scope="text, record">
          {{ statusObjShow[record.status] }}
        </template>
        <template slot="warningThreshold" slot-scope="text">
          <span v-for=" (item, key) in text.split(';')" :key="key">{{ key +1 }}:{{ warningThresholdObjShow[item] }};</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-button size="small" type="link" @click="detailHandel(text,record,index)">编辑</a-button>
          <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button>
        </template>
      </a-table>
      <addEdit ref="addEdit" @addSystemSuccess="searchHand" />
    </template>
  </CContent>
</template>
<script>
import addEdit from './addEdit'
const columns = [
    {
        title: '信用预警主题',
        dataIndex: 'themeName',
        width: 200
    },
    {
        title: '监测企业数量',
        dataIndex: 'superviseCount',
        width: 140
    },
    {
        title: '信用告警阀值',
        dataIndex: 'warningThreshold',
        width: 140,
         scopedSlots: { customRender: 'warningThreshold' },
    },
    {
        title: '监管部门',
        dataIndex: 'superviseName',
        width: 140
    },
    {
        title: '使用状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
        width: 80
    },
    {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 130
    }
]
export default {
    components: {addEdit },
  data () {
      return {
        sendForm: {
          themeName: null,
          status: null,
          superviseName: null,
        },
        statusObjShow: {
          '1': '使用',
          '2': '停用'
        },
        warningThresholdObjShow: {
           '1': '信用分波动',
          '2': '行政处罚',
           '3': '黑名单信息'
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
        this.$xttp.BigDateWarningSysApi.checkWarningList(this.queryParam).then((res) => {
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
          that.$xttp.BigDateWarningSysApi.deleteCheckWarningList({ body:[record.sid] }).then(res => {
            that.loading = false
            if (res.success) {
              that.$message.success('删除成功！')
              that.searchHand()
            } else {
              console.log('删除请求失败！', res.message)
              that.$message.error('删除请求失败！' + res.message)
            }
          })
            .catch(error => {
              if (error) {
                that.loading = false
                that.$message.error('删除失败！')
              }
            })
        },
        onCancel () {
        }
      })
    },
    addHandel () {
      this.$refs.addEdit.$emit('show',{pageType:'add'})
    },
    exportHandel () {},
    /* 查看详情 */
    detailHandel (text,record,index){
      const datas = record
      datas.pageType = 'edit'
      console.log(datas)
      this.$refs.addEdit.$emit('show',datas)
    }
  }
}
</script>

