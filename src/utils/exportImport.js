/*
 * @Description: 导入导出
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2021-01-08 15:31:00
 * @LastEditTime: 2021-01-08 16:57:55
 */
import store from '@/store'
import axios from '@/utils/request'
const exportHandel = (obj,callBack = ()=>{})=> {
    let send  = {
        url: '',
        method: 'POSt',
        responseType: 'blob',
        data: {body:{}}
    }
    send = Object.assign({},send,obj)
    axios(send).then((res)=>{
        console.log(res)
        const blob = res
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = (e) => {
        // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
          const a = document.createElement('a')
          console.log(store.getters)
          a.download = decodeURIComponent(store.getters.downLoadFileName)
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          callBack()
        }
    })
}

export {
    exportHandel
}