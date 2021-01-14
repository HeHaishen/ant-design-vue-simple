<!--
 * @Description: 信用核查-核查申请
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-12 18:02:06
-->
<template>
  <CContent>
    <template v-slot:contentinlineForm>
      <a-form layout="inline" :form="sendForm" class="c-list-form">
        <a-form-item label="指标名称" >
          <a-input
            allowClear
            v-model.trim="sendForm.tableName"
          />
        </a-form-item>
        <a-form-item label="状态" class="c-lineform-data">
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.status">
            <a-select-option value="1">使用</a-select-option>
            <a-select-option value="2">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="信用类型" class="c-lineform-data">
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.type">
            <a-select-option value="1">守信</a-select-option>
            <a-select-option value="2">失信</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="search" @click="searchHand">查询</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-form-item>
        <a-form-item class="c-lineform-data">
          <a-button type="primary" icon="plus" @click="addHandel">新增</a-button>
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
        <template slot="type" slot-scope="text, record">
          {{ typeObjShow[record.type] }}
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
        title: '指标中文名',
        dataIndex: 'tableName',
        width: 200
    },
    {
        title: '指标英文名',
        dataIndex: 'tableCode',
        width: 160
    },
    {
        title: '记录总数',
        dataIndex: 'no',
        width: 200
    },
    {
        title: '信用类型',
        dataIndex: 'type',
        width: 100,
        scopedSlots: { customRender: 'type' },
    },
    {
        title: '使用状态',
        dataIndex: 'status',
        width: 200,
        scopedSlots: { customRender: 'status' },
    },
    {
        title: '操作',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 140
    }
]
export default {
    components: { addEdit },
  data () {
      return {
        sendForm: {
          tableName: null,
          status: null, //	项目名称
          type: null //	经办人
        },
        statusObjShow:{
          '1':'使用',
          '2':'停用'
        },
        typeObjShow: {
          '1':'守信',
          '2':'失信'
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
          page: 1, // 第几页
          currentPage:1,
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
      this.queryParam.currentPage = pagination.current
      this.queryParam.page = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetch()
    },
    fetch () {
      this.loading = true
      const send = this.$filterParams(this.sendForm)
      this.queryParam.body = send
        this.$xttp.creditCheckApi.getTargetManagementList(this.queryParam).then((res) => {
          this.loading = false
          if (res.success) {
            this.pagination.total = parseInt(res.total)
            const pagination = { ...this.pagination }
            pagination.pages = res.pages
            this.listData = res['body']
            this.pagination = pagination
            // this.listData.map(async (item, index) => {
            //   item.INDEX = (res.body.pageNum - 1) * res.pageSize + index + 1
            // })
            // this.pagination = pagination
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
    addHandel () {
      this.$refs.addEdit.$emit('show',{pageType:'add'})
    },
     /* 删除 */
    deleteHandel (text, record, index) {
       const that = this
      this.$confirm({
        title: '提示',
        content: '确定删除此条记录？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.loading = true
          that.$xttp.creditCheckApi.deleteListTargetApi({body: [record.sid] }).then(res => {
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
                that.$message.error('删除失败！')
              }
            })
        },
        onCancel () {
        }
      })
    },
    /* 查看详情 */
    detailHandel (text,record,index){
      const datas =  record
      datas.pageType = 'edit'
      this.$refs.addEdit.$emit('show',datas)
    }
  }
}
</script>

