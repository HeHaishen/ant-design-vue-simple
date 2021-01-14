import request from '@/utils/request'

const userApi = {
  Login: '/creditCheck/auth/login',
  Logout: '/creditCheck/auth/logout',
  ForgePassword: '/creditCheck/auth/forge-password',
  Register: '/creditCheck/auth/register',
  twoStepCode: '/creditCheck/auth/2step-code',
  SendSms: '/creditCheck/account/sms',
  SendSmsErr: '/creditCheck/account/sms_err',
  // get my info
  UserInfo: '/creditCheck/user/info',
  UserMenu: '/creditCheck/user/nav',
  // 获取token
  verificationToken: '/creditCheck/tokenLogin/login',
  // 登录后-验证token是否已经登录
  verificationTokenAfter: '/creditCheck/tokenLogin/isAutheds',
  // 推出登录
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    // url:userApi.exitLoginOut,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}

/*
*gov-跳转登录后验证token
*
*/
export function verificationToken (params) {
  return request({
    url: `${userApi.verificationToken}?token=${params.token}`,
    method: 'post',
    data: {}
  })
}

/* 
*登录后-验证token是否已经登录
*/
export function verificationTokenAfter (params) {
  return request({
    url: userApi.verificationTokenAfter,
    method: 'post',
    data: {}
  })
}

