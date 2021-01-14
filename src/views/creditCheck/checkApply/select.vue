<!--
 * @Description: 点击选择
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-29 10:17:08
 * @LastEditTime: 2021-01-05 11:55:11
-->
<template>
  <a-modal v-model="show" title="选择企业" width="70%" :footer="null">
    <a-spin :spinning="spinning">
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
      <div class="c-modal-content">
        <a-table
          bordered
          :columns="columns"
          :components="components" 
          :data-source="listDatas" 
          :pagination="pagination"
          @change="handleTableChange"
          :rowKey="(record, index) => index"
        >
          <template slot="operation" slot-scope="text, record, index">
            <a-radio-group v-model="choseValue" @change="radioChange">
              <a-radio :value="index"></a-radio>
            </a-radio-group>
          </template></a-table>
      </div>
      <div class="c-modal-btn">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
        <a-button v-show="!spinning" key="submit" type="primary" @click="handleOk">
          确定
        </a-button>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from 'vue'
// import { getCommanyList } from '@/api/creditCheck'
const columns = [
    {
        title: '选择',
        key: 'operation',
        scopedSlots: { customRender: 'operation' },
         width: 40
    },
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
const draggingMap = {}
columns.forEach((col) => {
  draggingMap[col.key] = col.width
})
const draggingState = Vue.observable(draggingMap)
const resizeableTitle = (h, props, children) => {
  let thDom = null
  const { key, ...restProps } = props
  const col = columns.find((col) => {
    const k = col.dataIndex || col.key
    return k === key
  })
  if (!col.width) {
    return <th {...restProps}>{children}</th>
  }
  const onDrag = (x) => {
    draggingState[key] = 0
    col.width = Math.max(x, 1)
  }
  const onDragstop = () => {
    draggingState[key] = thDom.getBoundingClientRect().width
  }
  return (
    <th
      {...restProps}
      v-ant-ref={(r) => (thDom = r)}
      width={col.width}
      class="resize-table-th"
    >
      {children}
      <vue-draggable-resizable
        key={col.key}
        class="table-draggable-handle"
        w={10}
        x={draggingState[key] || col.width}
        z={1}
        axis="x"
        draggable={true}
        resizable={false}
        onDragging={onDrag}
        onDragstop={onDragstop}
      ></vue-draggable-resizable>
    </th>
  )
}
export default {
    data () {
        this.components = {
            header: {
                cell: resizeableTitle
            }
        }
        return {
            show: false,
            spinning: false,
            /* 表格部分 */
            columns: columns,
            listDatas: [],
            sendForm: {
              qymc: null, // string 机构名称
              tyshxydm: null, //	string 应用系统名称
              fddbr: null, //	string 应用系统类别 （1软件应用系统 2硬件应用系统 3软硬件集成应用系统 4基础支撑系统）
            },
            choseValue: null,
            pagination: {
                total: 0,
                defaultPageSize: 10,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '40'],
                // eslint-disable-next-line no-return-assign
                onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
            },
            queryParam: {
                currentPage:1,
                page: 1, // 第几页
                pageSize: 10 // 每页中显示数据的条数
            }
        }
    },
    created () {},
    mounted () {
        this.$on('show', (data) => {
            this.initPage()
            this.getList()
        })
    },
    methods: {
        initPage () {
            this.spinning = true
            this.show = true
            this.spinning = false
            for (const key in this.sendForm) {
              this.sendForm[key] = null
            }
        },
        getList () {
          this.spinning = true
          const send = this.$filterParams(this.sendForm)
          this.queryParam.body = send
          this.$xttp.creditCheckApi.getCommanyList(
            this.queryParam
          ).then((res)=>{
            this.spinning = false
            this.listDatas = []
            if(res.success){
              this.choseValue = null
              this.pagination.total = parseInt(res.total)
              const pagination = { ...this.pagination }
              pagination.pages = res.page
              this.listDatas = res.body
               this.pagination = pagination
            }else{
              this.$message.error(res.message)
            }
          }).catch((error)=>{
            this.$message.error('网络错误，请刷新重试！')
          })
          // getCommanyList(
          //   send
          // ).then(res=>{
          //    this.choseValue = null
          //   this.pagination.total = parseInt(res.total)
          //   const pagination = { ...this.pagination }
          //   pagination.pages = res.page
          //   this.listDatas = res.body
          // })
        },
        initData () {
            this.choseValue = null
            this.pagination = JSON.parse(JSON.stringify(
                {
                    total: 0,
                    defaultPageSize: 10,
                    showTotal: total => `共 ${total} 条数据`,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '40'],
                    // eslint-disable-next-line no-return-assign
                    onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
                }
            ))
        },
        handleTableChange (pagination) {
          this.pagination.current = pagination.current
          this.pagination.pageSize = pagination.pageSize
          this.queryParam.page = pagination.current
          this.queryParam.currentPage = pagination.current
          this.queryParam.pageSize = pagination.pageSize
          this.getList()
        },
        getTableList () {
        },
        handleOk () {
            if (this.choseValue || this.choseValue === 0) {
               this.$emit('selectSure', this.listDatas[this.choseValue])
                this.show = false
            } else {
                this.$message.warning('请选择企业！')
            }
        },
        handleCancel () {
          this.show = false
        },
        radioChange (value, row) {
            console.log(value, this.choseValue)
        },
        searchHand () {
        this.queryParam = {
          page: 1,
          currentPage:1,
          pageSize: 10
        }
        this.getList()
      },
      // 重置
      reset () {
        this.pagination.current = 1
        this.pagination.pageSize = 10
        this.queryParam = {
          currentPage:1,
          page: 1, // 第几页
          pageSize: 10 // 每页中显示数据的条数
        }
        this.clearnDatas(() => {
          this.getList()
        })
      },
      clearnDatas (callBack) {
        for (const key in this.sendForm) {
          this.sendForm[key] = null
        }
        callBack()
      }
    }
}
</script>

<style lang="less">
.resize-table-th {
  position: relative;
  .table-draggable-handle {
    height: 100% !important;
    bottom: 0;
    left: auto !important;
    right: -5px;
    cursor: col-resize;
    touch-action: none;
  }
}
</style>
