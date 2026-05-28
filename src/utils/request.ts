import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000
})

// 请求拦截器：修复 Pinia 调用方式（避免实例化报错）
service.interceptors.request.use(
  async (config) => {
    // 延迟导入 useUserStore，避免初始化报错
    const { useUserStore } = await import('@/store/modules/user')
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：修复 401 逻辑 + 删除不存在的 resetToken
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 后端返回非200，直接抛出错误
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  async (error) => {
    // 401 未登录/ token过期
    if (error.response?.status === 401) {
      ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
        type: 'warning'
      }).then(async () => {
        const { useUserStore } = await import('@/store/modules/user')
        const userStore = useUserStore()
        // 替换为你存在的 logout 方法
        await userStore.logout()
        location.reload()
      })
    } else {
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

export default service
