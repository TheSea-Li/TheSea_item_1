import request from '@/utils/request'

// 获取路由
export function getRoutes() {
  return request({
    url: '/system/routes',
    method: 'get'
  })
}
