import request from '@/utils/request'

export function getRoleList(params: any) {
  return request({ url: '/system/role/list', method: 'get', params })
}
export function addRole(data: any) {
  return request({ url: '/system/role/add', method: 'post', data })
}
export function editRole(data: any) {
  return request({ url: '/system/role/edit', method: 'put', data })
}
export function delRole(id: number) {
  return request({ url: `/system/role/del/${id}`, method: 'delete' })
}
