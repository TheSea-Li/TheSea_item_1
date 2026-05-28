import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getUserInfo } from '@/api/system/user'

interface UserState {
  token: string
  name: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken() || '',
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }),
  actions: {
    //登录
    async login(userInfo: { username: string; password: string }) {
      const { username, password } = userInfo
      const res = await login({ username: username.trim(), password })
      this.token = res.data.token
      setToken(res.data.token)
    },
    //获取用户信息
    async getUserInfo() {
      console.log('调用getUserInfo')
      const res = await getUserInfo()
      this.name = res.data.name
      this.avatar = res.data.avatar
      this.roles = res.data.roles
      this.permissions = res.data.permissions
      return res.data
    },

    // 退出登录
    async logout() {
      console.log('调用logout')
      await logout()
      this.token = ''
      this.roles = []
      this.permissions = []
      removeToken()
    },

    //重置Token
    resetToken() {
      this.token = ''
      this.roles = []
      this.permissions = []
      removeToken()
    }
  }
})
