<!--
 * @Description: 信用核查-新增名单
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 19:27:59
 * @LastEditTime: 2021-01-04 11:37:55
-->
<template>
  <a-modal
    title="新增名单"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    width="85%"
    okText="保存"
  >
    <CContent :titleShow="false" :formShow="true">
      <template v-slot:contentinlineForm>
        <a-form layout="inline" :form="sendForm">
          <a-form-item label="企业名称">
            <a-input allowClear v-model.trim="sendForm.qymc" />
          </a-form-item>
          <a-form-item label="统一社会信用代码">
            <a-input allowClear v-model.trim="sendForm.tyshxydm" />
          </a-form-item>
          <a-form-item label="企业法人">
            <a-input allowClear v-model.trim="sendForm.fddbr" />
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
        <!-- <a-table
          width="100%"
          v-if="visible"
          :columns="columns"
          :dataSource="listDatas"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :rowKey="(record, index) => index"
          :rowSelection="{ selectedRowKeys: selectedRowKeys,
                           onChange: onSelectChange,
                           onSelect: onSelectTable,
                           onSelectAll:onSelectAll
          }"
        > -->
        <a-table
          width="100%"
          v-if="visible"
          :columns="columns"
          :dataSource="listDatas"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          :rowKey="(record, index) => index"
          :row-selection="rowSelection"
        >
          <template slot="operation" slot-scope="text, record, index">
            <a-button type="link" @click="deleteHandel(text,record,index)">删除</a-button>
          </template>
        </a-table>
      </template>
    </CContent>
  </a-modal>
</template>
<script>
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
    }
]
export default {
  data () {
    return {
      columns,
      confirmLoading: false,
      visible: false,
      loading: false,
      sendForm: {
        qymc: null, // string 机构名称
        tyshxydm: null, //	string 应用系统名称
        fddbr: null, //	string 应用系统类别 （1软件应用系统 2硬件应用系统 3软硬件集成应用系统 4基础支撑系统）
      },
      listDatas: [],
      selectedRows: [],
      selectedRowKeys: [],
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
  computed: {
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRowKeys = selectedRowKeys
        },
        selectedRowKeys: this.selectedRowKeys,
        onSelect: (record, selected, selectedRows, nativeEvent) => {
          if (selected) { // 选中
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.selectedRows.push(record)
          } else { // 取消
            const rowList = JSON.parse(JSON.stringify(this.selectedRows))
            rowList.map((i, k) => {
              if (i.tyshxydm === record.tyshxydm) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.selectedRows.splice(k, 1)
                // console.log(this.selectedRows)
              }
            })
          }
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabledType, // Column configuration not to be checked
            name: record.tyshxydm
          }
        }),
        columnTitle:(record) =>{
          return ''
        }
      }
    }
  },
  mounted () {
    this.$on('show', data => {
      this.visible = true
      this.initData()
      this.parentDatas = data
    })
  },
  methods: {
    initData () {
      this.parentDatas = []
      this.selectedRowKeys = []
      this.listData = []
      this.selectedRows = []
      this.fetch()
    },
    // 初始化表格是否可以选中
    initSelectType (row,list) {
      if(list.length){
       const record = list.find((i, k) => {if(row.tyshxydm === i.tyshxydm){ return row }})
       const type = record ? true : false
       return type
      }
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
      this.selectedRows = []
      this.selectedRowKeys = []
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
      // this.selectedRowKeys = []
    },
    fetch () {
      this.loading = true
      const send = this.$filterParams(this.sendForm)
      this.queryParam.body = send
      this.$xttp.creditCheckApi.getCommanyList(
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
          this.listDatas.map((i ,k)=>{
            this.listDatas[k].disabledType = this.initSelectType(i, this.parentDatas)
          })
        }else{
          this.listDatas =  []
          this.loading = false
        }
      }).catch((error)=>{
        if(error){
          this.loading = false
        }
      })
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
      console.log(789, record, selected, selectedRows)
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
    // 保存
    handleOk () {
      console.log(this.selectedRows)
      const list = JSON.parse(JSON.stringify(this.selectedRows))
      this.$emit('addSystemSuccess', list)
      this.visible = false
    //   this.selectedRowKeys.map((item, index) => {
    //       this.listData.find((i)=>)
    //   })
    },
    // 返回
    handleCancel () {
      this.visible = false
    },
    /*删除 */
    deleteHandel (text,row,index) {
        
    }
  }
}
</script>
<style lang="less" scoped>
</style>
