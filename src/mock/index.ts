// 导入你写的 Mock 函数
import { login, getUserInfo, getRoutes } from './system'
import Mock from 'mockjs'

// 模拟网络延迟
Mock.setup({ timeout: '200-600' })

// 🔥 关键：接口地址 必须 和 axios 请求的地址 完全一致
// 1. 登录接口（匹配你的请求：/api/user/login）
Mock.mock('/api/user/login', 'post', login)
// 2. 获取用户信息接口
Mock.mock('/api/user/info', 'get', getUserInfo)
// 3. 获取路由菜单接口
Mock.mock('/api/system/routes', 'get', getRoutes)

export default Mock
