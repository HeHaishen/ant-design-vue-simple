/*
 * @Description: 信用核查-api
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-31 16:22:55
 * @LastEditTime: 2021-01-08 17:12:24
 */
import axios from '@/utils/request'

const InfoPerformanceSupervisionApi = {
    dataPerformanceList: '/merits-server/credit/CreditCollectCount/find', // 数据归集统计
    dataPerformanceListExport: '/merits-server/credit/CreditCollectCount/export', // 数据归集统计-导出
    dataUpdateList: '/merits-server/credit/CreditUpdateCount/find', // 数据更新统计
    dataUpdateListExport: '/merits-server/credit/CreditUpdateCount/export', // 数据更新统计-导出
    superviseList: '/merits-server/credit/CrediSupervision/find', // 督办统计接口
    formulaReportList: '/merits-server/credit/sgsCount/find', // 双公示
    infoAppList: '/merits-server/credit/CreditApplicationCount/find'   //信用应用接口
}
export default {
  // 获取企业列表
  dataPerformanceList: body => axios.post(InfoPerformanceSupervisionApi.dataPerformanceList, body),// 数据归集统计
  dataUpdateList: body => axios.post(InfoPerformanceSupervisionApi.dataUpdateList, body),// 数据更新统计
  superviseList: body => axios.post(InfoPerformanceSupervisionApi.superviseList, body),
  formulaReportList: body => axios.post(InfoPerformanceSupervisionApi.formulaReportList, body),
  infoAppList: body => axios.post(InfoPerformanceSupervisionApi.infoAppList, body)
}
