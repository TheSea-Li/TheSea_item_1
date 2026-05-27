import request from '@/utils/request'

// 登录
export function login(data: any) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取用户列表
export function getUserList(params: any) {
  return request({ url: '/system/user/list', method: 'get', params })
}
// 新增用户
export function addUser(data: any) {
  return request({ url: '/system/user/add', method: 'post', data })
}
// 编辑用户
export function editUser(data: any) {
  return request({ url: '/system/user/edit', method: 'put', data })
}
// 删除单个用户
export function delUser(id: number) {
  return request({ url: `/system/user/del/${id}`, method: 'delete' })
}
// 批量删除用户
export function batchDelUser(ids: number[]) {
  return request({ url: '/system/user/batchDel', method: 'delete', data: { ids } })
}
// 重置密码
export function resetPwd(id: number) {
  return request({ url: `/system/user/resetPwd/${id}`, method: 'put' })
}
