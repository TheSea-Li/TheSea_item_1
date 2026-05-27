import request from '@/utils/request'

// 获取路由
export function getRoutes() {
  return request({
    url: '/system/routes',
    method: 'get'
  })
}

// 获取菜单列表
export function getMenuList(params: any) {
  return request({ url: '/system/menu/list', method: 'get', params })
}
export function addMenu(data: any) {
  return request({ url: '/system/menu/add', method: 'post', data })
}
export function editMenu(data: any) {
  return request({ url: '/system/menu/edit', method: 'put', data })
}
export function delMenu(id: number) {
  return request({ url: `/system/menu/del/${id}`, method: 'delete' })
}
