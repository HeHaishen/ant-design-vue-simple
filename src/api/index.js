/*
 * @Description: 自动引入api
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-12-31 19:18:48
 * @LastEditTime: 2020-12-31 19:22:27
 */
// 自动引入api
const context = require.context('./pageApis', true, /\Api.js$/)

const api = {}
context.keys().map(file => {
  const apiObj = context(file).default
  const apiName = file.split('/')[1]
  const saveName = apiName.slice(0, -3)
  api[saveName] = Object.assign({}, apiObj)
})
export default api
