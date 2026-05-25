import axios from 'axios'
import { useUserStore } from '@store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, //从环境变量获取接口地址
  timeout: 15000 //请求超时时间
})

//请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    //自动添加token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    //这里的code要和后端约定好，比如200表示成功
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
    }

    //401:token过期或未登录
    if (res.code === 401) {
      ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const userStore = useUserStore()
        userStore.resetToken()
        location.reload()
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
