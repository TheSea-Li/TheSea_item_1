import request from '@/utils/request'

export function getDictList(params: any) {
  return request({ url: '/system/dict/list', method: 'get', params })
}
export function addDict(data: any) {
  return request({ url: '/system/dict/add', method: 'post', data })
}
export function editDict(data: any) {
  return request({ url: '/system/dict/edit', method: 'put', data })
}
export function delDict(id: number) {
  return request({ url: `/system/dict/del/${id}`, method: 'delete' })
}
