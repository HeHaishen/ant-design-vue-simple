/*
 * @Description: 全局方法
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2020-03-23 10:53:22
 * @LastEditTime: 2020-10-19 14:47:51
 */
import moment from 'moment'
const filterParams = (par) => {
  /**
     * @description 过滤为空、空字符串参数
     * @param par
     * @returns
     */
  const _par = par
  const _newPar = {}
  for (const key in _par) {
    if ((_par[key] == 0 || _par[key]) && _par[key].toString().replace(/\s/g, '') !== '') {
      _newPar[key] = _par[key]
    }
  }
  return _newPar
}
const diffData = (newVal, oldVal) => {
  // 字符串/数字/null/undefined/Boolean
  if (typeof oldVal === 'string' || typeof oldVal === 'number' || typeof oldVal === 'boolean' || oldVal == undefined) {
    if (oldVal === '' && newVal == undefined) {
      return false
    }
    return oldVal != newVal
  }
  // 类型变更
  if (typeof oldVal !== typeof newVal) {
    return true
  }
  // 数组
  if (Array.isArray(oldVal)) {
    if (oldVal.length !== newVal.length) return true
    return oldVal.some((val, index) => diffData(newVal[index], val))
  }
  // 对象
  if (String(oldVal) === '[object Object]') {
    return Object.keys(oldVal).some(key => diffData(newVal[key], oldVal[key]))
  }
}
/**
 * @Autor: hehaishen
 * @description: 过滤金钱/柱子过滤-数值 放在-input事件中
 *               在input框中输入如果不符合规则的会变成空 f
 *               使用方法：newVal = await allInputChange(改变的值，input最大长度，小数点后多少位)
 * @param {String/Number,Number,Number}
 * @return: Number
 */
const allInputChange = (value, maxlegth, pointerLength) => {
  console.log('gggg', value, maxlegth, pointerLength)
  const reg = /^[1-9]\d*$/// 正整数
  const isNum = /^[0-9]+([.]{1}[0-9]+){0,1}$/// 数字
  const pointerIndex = null
  const pointerNum = 0
  console.log(7777, isNum.test(value), value)
  if (isNum.test(value)) { // 如果是数字
    if (reg.test(value)) { // 如果是正整数
      value = value.length > maxlegth - (pointerLength + 1) ? value.slice(0, maxlegth - (pointerLength + 1)) : value
      return value
    } else {
      // const valArr = value.split('')
      // console.log('arr', valArr)
      // for (let x = 0; x < valArr.length; x++) {
      //   if (valArr[x] == '.') {
      //     pointerIndex = x
      //     pointerNum++
      //   }
      // }
      // console.log('jjjj', value, pointerIndex)
      // value = value.slice(0, pointerIndex + 3)
      const valArr = value.split('.')
      value = valArr[0].slice(0, maxlegth - pointerLength - 1) + '.' + valArr[1].slice(0, pointerLength)
      // console.log(888888888, value)
      return value
    }
  } else if (!isNum.test(value) && value.length > 1) { // 如果不是数字并且长度大于1
    const splitList = value.split('.')
    console.log('splitList[1]', splitList[1],reg.test(splitList[1]) === '')
    if (splitList.length === 2) {
      if (reg.test(splitList[0]) && splitList[1] === '') {
        return value
      } else if (splitList[0] === '0' && splitList[1] === '') {
        return value
      } else {
        value = null
        return null
      }
    } else {
      value = null
      return null
    }
    // const valArr = value.split('')
    // for (let x = 0; x < valArr.length; x++) {
    //   if (valArr[x] == '.') {
    //     pointerIndex = x
    //     pointerNum++
    //   }
    // }
    // if (pointerNum > 1 || (pointerNum == 0) && !isNum.test(value)) {
    //   value = null
    //   return value
    // } else if (pointerIndex && pointerNum == 1) {
    //   value = value.slice(0, pointerIndex + 3)
    //   return value
    // } else {
    //   value = null
    //   return value
    // }
  } else {
    value = null
    return value = null
  }
}
/**
 * 日期-过滤（默认今天之后-包括今天）
 * 在日期过滤时使用:disabledDate="(current)=>{disabledDate(current,'type')}"
 * @param date(),String 数值(Date()和String)
 * @return 日期组件中使用,如'disabledDate="(current)=>{disabledDate(current,'type')}'
 * @type  date(),String
 */
const disabledDate = (current, type = 'today') => {
  if (type === 'before') { // 过滤-过去的日子不可选
    return current && current < moment().startOf('day')
  }
  if (type === 'before-today') { // 过滤-过去的日子不可选（包括今天）
    return current && current < moment().endOf('day')
  }
  if (type === 'today') { // 过滤-将来的日子不可选
    return current && current > moment().endOf('day')
  }
  if (type === 'future') { // 过滤-将来的日子不可选（包括今天）
    return current && current > moment().endOf('day').subtract(1, 'days')
  }
}

export { filterParams, diffData, allInputChange, disabledDate }
