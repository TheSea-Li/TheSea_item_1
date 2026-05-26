import { login, getUserInfo } from '@/api/system/user'
import { getRoutes } from '@/api/system/menu'
import Mock from 'mockjs'

Mock.setup({ timeout: '200-600' })

//拦截接口
Mock.mock('/api/system/login', 'post', login)
Mock.mock('/api/system/user/info', 'get', getUserInfo)
Mock.mock('/api/system/routes', 'get', getRoutes)

export default Mock
