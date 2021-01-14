import storage from 'store'
import { login, getInfo, logout, verificationToken, verificationTokenAfter } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { userData } from '@/utils/permissionData'
import { globalUrl } from '@/utils/configUrl'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    // tonken 验证后-存储用户登录信息
    loginUserInfo:{},
    // 文件下载文件名称
    downLoadFileName: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    set_LOGINUSERINFO:(state, userinfo) => {
      state.loginUserInfo = userinfo
    },
    SET_DOWNLOADFILENAME:(state, downLoadFileName) => {
      state.downLoadFileName = downLoadFileName
    },
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          response = null
          console.log('login',response)
          const result = response.result
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit,state }) {
      return new Promise((resolve, reject) => {
          // verificationToken(state.token).then((res) => {
          //   res = userData
          //   resolve(res)
          // }).catch((err) => {
          //   resolve()
          // }).finally(() => {
          // })
          verificationTokenAfter().then((res) => {
            console.log(res)
            if (res.success) {
              // 登录接口---处理权限拼接
              commit('set_LOGINUSERINFO',res)
              const response = userData
              response.success = res.success
              // getInfo().then(response => {
              const result = response.result
              console.log('response',response)
              if (result.role && result.role.permissions.length > 0) {
                const role = result.role
                role.permissions = result.role.permissions
                role.permissions.map(per => {
                  if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                    const action = per.actionEntitySet.map(action => { return action.action })
                    per.actionList = action
                  }
                })
                role.permissionList = role.permissions.map(permission => { return permission.permissionId })
                commit('SET_ROLES', result.role)
                commit('SET_INFO', result)
              } else {
                reject(new Error('getInfo: roles must be a non-null array !'))
              }
              commit('SET_NAME', { name: result.name, welcome: welcome() })
              commit('SET_AVATAR', result.avatar)
              resolve(response)
            } else {
              const response = {}
              console.log(response)
              response.success = false
              commit('SET_TOKEN', '')
              commit('SET_ROLES', [])
              resolve()
              window.location.href = globalUrl
            }
        }).catch(error => {
          if(error){
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            reject(error)
          }
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          window.location.href = globalUrl
          resolve()
        }).catch((err) => {
          console.log(err)
          if(err){
            window.location.href = globalUrl
          }
          resolve()
        }).finally(() => {
        })
      })
    },

    // 验证token
    verificationTokens ({ commit, state },token) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      storage.remove(ACCESS_TOKEN)
      return new Promise((resolve) => {
        verificationToken(token).then((res) => {
          /* console.log('login',res)
          commit('SET_TOKEN', res.token)
          res = userData
          res.success = true
          resolve(res)
        }).catch((err) => {
          resolve(err)
        }).finally(() => {
        }) */
        const response = userData
        response.success = res.success
        if(res.success){
          console.log(res)
          storage.set(ACCESS_TOKEN, res.token)
          commit('SET_TOKEN', res.success)
          commit('set_LOGINUSERINFO',res)
          // response.result = 
        }else{

        }
          // getInfo().then(response => {
          const result = response.result
          console.log('first-response',response)
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          if(error){

            reject(error)
          }
          
        })
      })
    },

    // 设置文件下载名称
    downLoadFileNameHandel({commit,state},downLoadFileName){
      commit('SET_DOWNLOADFILENAME', downLoadFileName)
    }

  }
}

export default user
