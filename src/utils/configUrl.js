/*
 * @Description: 配置跳转页面url
 * @Version: 1.0
 * @Autor: hehaishen
 * @LastEditors: hehaishen
 * @Date: 2021-01-07 17:17:56
 * @LastEditTime: 2021-01-07 17:21:39
 */
const jumpUrl = {
    'development':'http://10.100.10.58:8080/credit-gov/index.jsp',
    'production':'http://10.0.14.14:8080/credit-gov/index.jsp'
}

const globalUrl =  jumpUrl[ process.env.NODE_ENV ]

export {
    globalUrl
}
