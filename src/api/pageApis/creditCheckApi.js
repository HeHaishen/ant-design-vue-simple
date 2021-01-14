/*
 * @Description: 信用核查-api
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-31 16:22:55
 * @LastEditTime: 2021-01-07 16:07:48
 */
import axios from '@/utils/request'

const creditCheckApi = {
    getCommany: 'creditCheck/credit/corpInfo/find', // 获取企业列表
    saveCreditCheck:'creditCheck/credit/checkApply/save', // 新增保存核查申请
    saveBatchCreditCheck:'creditCheck/credit/checkApply/batchSave', // 新增保存核查申请
    getNameListFind: 'creditCheck/credit/checkEnt/find', // 查询获取企业名单---批量获取名单
    getNameList: 'creditCheck/credit/checkEnt/find', // 获取企业名单
    editNameList: 'creditCheck/credit/checkEnt/update', //  修改企业名单
    addNameList: 'creditCheck/credit/checkEnt/save', //  新增企业名单
    deleteNameList: 'creditCheck/credit/checkEnt/delete', // 获取企业名单
    getCheckApplyList: 'creditCheck/credit/checkApply/find', // 获取核查列表
    getCheckApplyReport:'creditCheck/credit/checkApply/getResult', // 获取报告详情
    getTargetManagement:'creditCheck/credit/checkThemeInfoDetail/find', // 核查指标管理
    getTakeNameListApi:'creditCheck/credit/checkThemeInfoDetail/findTCommon', // // 获取指标名称-选择
    getTarkeNameChoseListApi:'creditCheck/credit/checkThemeInfoDetail/findTCommonfield', // 选择指标名称-后获取列表
    addListTargetApi: 'creditCheck/credit/checkThemeInfoDetail/save', // 新增指标
    editListTargetApi: 'creditCheck/credit/checkThemeInfoDetail/update', // 编辑指标
    deleteListTargetApi: 'creditCheck/credit/checkThemeInfoDetail/delete', // 编辑指标
    getCreditMainExtendList: '/creditCheck/credit/checkResult/find' // 获取申请信用核查结果
}
export default {
  // 获取企业列表
  getCommanyList:body => axios.post(creditCheckApi.getCommany, body),
  // 新增保存核查申请
  saveCreditCheck:body => axios.post(creditCheckApi.saveCreditCheck, body),
  // 批量新增保存核查申请
  saveBatchCreditCheck:body => axios.post(creditCheckApi.saveBatchCreditCheck, body),
  // 查询获取企业名单---批量获取名单
  getNameListFind: body => axios.post(creditCheckApi.getNameListFind, body),
  // 获取企业名单
  getNameList: body => axios.post(creditCheckApi.getNameList, body),
  // 修改企业名单
  editNameList: body => axios.post(creditCheckApi.editNameList, body),
  // 新增企业名单
  addNameList: body => axios.post(creditCheckApi.addNameList, body),
  // 删除企业名单
  // deleteNameList: body => axios.delete(creditCheckApi.deleteNameList, body),
  deleteNameList: (parameter)=>{
    return axios({
      url: creditCheckApi.deleteNameList,
      method: 'DELETE',
      data: parameter
    })
  },
  getCheckApplyList: body => axios.post(creditCheckApi.getCheckApplyList, body),
  // 获取报告详情
  getCheckApplyReport: body => axios.get(`${creditCheckApi.getCheckApplyReport}/${body.sid}`),
  /* 核查指标管理服务 */
  // 获取指标列表
  getTargetManagementList:  body => axios.post(creditCheckApi.getTargetManagement, body),
  // 获取指标名称-选择
  getTakeNameListApi:  body => axios.post(creditCheckApi.getTakeNameListApi, body),
  //  选择指标名称-后获取列表
  getTarkeNameChoseListApi:  body => axios.post(creditCheckApi.getTarkeNameChoseListApi, body),
  //  新增指标
  addListTargetApi:  body => axios.post(creditCheckApi.addListTargetApi, body),
  //  新增指标
  editListTargetApi:  body => axios.post(creditCheckApi.editListTargetApi, body),
  //  删除指标
  deleteListTargetApi:(parameter)=>{
    return axios({
      url: creditCheckApi.deleteListTargetApi,
      method: 'DELETE',
      data: parameter
    })
  },
  getCreditMainExtendList:body => axios.post(creditCheckApi.getCreditMainExtendList, body),
}
