<!--
 * @Description: 信用核查-核查申请
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-28 16:08:53
 * @LastEditTime: 2021-01-07 09:32:05
-->
<template>
  <CContent>
    <template v-slot:contentinlineForm>
      <a-form layout="inline" :form="sendForm" class="c-list-form">
        <a-form-item label="名单名称" >
          <a-input
            allowClear
            v-model.trim="sendForm.name"
          />
        </a-form-item>
        <a-form-item label="创建人" >
          <a-input
            allowClear
            v-model.trim="sendForm.orgName"
          />
        </a-form-item>
        <a-form-item label="创建时间" class="c-lineform-data">
          <a-range-picker :locale="'locale'" :placeholder="['开始日期', '结束日期']" v-model.trim="datasArr">
          </a-range-picker>
        </a-form-item>
        <a-form-item label="状态" >
          <a-select allowClear style="width: 200px" v-model.trim="sendForm.status">
            <a-select-option value="1">使用</a-select-option>
            <a-select-option value="0">停用</a-select-option>
          </a-select>
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
        <template slot="status" slot-scope="text, record">
          {{ statusObj[record.status] }}
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-button size="small" type="link" @click="detailHandel(text,record,index)">编辑</a-button>
          <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button>
        </template>
      </a-table>
      <addNameList ref="addNameList" @addSystemSuccess="searchHand" />
    </template>
  </CContent>
</template>
<script>
import addNameList from './addCheckList'
import moment from 'moment'
const columns = [
    {
        title: '激励名单名称',
        dataIndex: 'name',
        width: 200
    },
    {
        title: '发文机关',
        dataIndex: 'orgName',
        width: 200
    },
    {
        title: '发布日期',
        dataIndex: 'startDate',
        width: 120
    },
    {
        title: '有效期',
        dataIndex: 'lastUpdatedBy',
        width: 120
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
         width: 100
    }
]
export default {
  components: { addNameList },
  data () {
      return {
        sendForm: {
          name: null, //	项目名称
          orgName: null, //	经办人
          status: null,
          startDate: null,
          endDate: null
        },
        loading: false,
        columns,
        statusObj: {
          '1':'使用',
          '0':'停用',
          '':'停用'
        },
        datasArr: [],
        listData: [],
        pagination: { 
          total: 0,
          defaultPageSize: 10,
          showTotal: total => `共 ${total} 条数据`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '40'],
          onShowSizeChange:  (current, pageSize) => (this.pageSize = pageSize)
        },
        queryParam: {
          currentPage:1,
          page: 1, // 第几页
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
      this.datasArr = []
      this.queryParam = {
        currentPage:1,
        page: 1,
        pageSize: 10
      }
      this.fetch()
    },
    addHandel () {
      this.$refs.addNameList.$emit('show',{pageType: 'add'})
    },
    clearnDatas (callBack) {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.queryParam = {
        currentPage: 1,
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
      this.queryParam.currentPage = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.fetch()
    },
    fetch () {
      this.loading = true
      if (this.datasArr.length) {
        this.sendForm.startDate = moment(this.datasArr[0]).format('YYYY-MM-DD hh:mm:ss')
        this.sendForm.endDate = moment(this.datasArr[1]).format('YYYY-MM-DD hh:mm:ss')
      }
      const send = this.$filterParams(this.sendForm)
      this.queryParam.body = send
        this.$xttp.creditCheckApi.getNameList(
          this.queryParam
        ).then((res) => {
          this.loading = false
          if (res.success) {
            this.pagination.total = parseInt(res.total)
            const pagination = { ...this.pagination }
             pagination.pages = res.page
            this.listData = res.body
            // this.listData.map(async (item, index) => {
            //   item.INDEX = (res.body.pageNum - 1) * res.body.pageSize + index + 1
            // })
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
       console.log(record)
      this.$confirm({
        title: '提示',
        content: '确定删除此？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          that.loading = true
          that.$xttp.creditCheckApi.deleteNameList({body: [record.sid]}).then(res => {
              that.loading = false
              if (res.success) {
                that.$message.success('删除成功！')
                that.searchHand()
              } else {
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
      const obj = record
      console.log(text,record,index)
      record.pageType = 'edit'
      this.$refs.addNameList.$emit('show',record)
    }
  }
}
</script>
