/*
 * @Description: 信用核查-api
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-31 16:22:55
 * @LastEditTime: 2021-01-04 18:32:43
 */
import axios from '@/utils/request'

const BigDateWarningSysApi = {
    checkWarningList: '/record-server/credit/entMonitor/find', // 业信用监测预警列表
    AddcheckWarningList: '/record-server/credit/entMonitor/save', // 业信用监测预警列表新增
    editcheckWarningList: '/record-server/credit/entMonitor/update', // 业信用监测预警列表新增
    deletecheckWarningList: '/record-server/credit/entMonitor/delete', // 业信用监测预警列表-删除
    // /record-server/credit/creditEntMonitorResult/find
    warningInfoList: '/record-server/credit/creditEntMonitorResult/find' //预警信息应用-列表
}

export default {
  // 企业信用监测预警
  checkWarningList: body => axios.post(BigDateWarningSysApi.checkWarningList, body),
  // 信用监测预警-新增
  addCheckWarningList: body => axios.post(BigDateWarningSysApi.AddcheckWarningList, body),
  // 信用监测预警-编辑
  editCheckWarningList: body => axios.post(BigDateWarningSysApi.editcheckWarningList, body),
  // 信用监测预警-删除
  deleteCheckWarningList: (parameter)=>{
    return axios({
      url: BigDateWarningSysApi.deletecheckWarningList,
      method: 'DELETE',
      data: parameter
    })
  },
  // 预警信息应用-列表
  warningInfoList: body => axios.post(BigDateWarningSysApi.warningInfoList, body),
}
