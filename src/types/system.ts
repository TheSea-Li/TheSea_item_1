// 业务实体类型
// 用户实体
export interface UserItem {
  id: number
  username: string
  nickname: string
  phone: string
  gender: number
  status: number
  roleId: number
  roleName: string
  createTime: string
}

// 角色实体
export interface RoleItem {
  id: number
  roleName: string
  roleKey: string
  sort: number
  status: number
  createTime: string
}

// 菜单实体（树形结构）
export interface MenuItem {
  id: number
  parentId: number
  menuName: string
  menuType: number
  path: string
  component: string
  icon: string
  sort: number
  status: number
  children?: MenuItem[]
}

// 弹窗通用状态
export interface DialogState {
  visible: boolean
  isEdit: boolean
  title: string
}
