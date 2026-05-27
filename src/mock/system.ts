import Mock from 'mockjs'

// 用户登录
export const login = () => {
  return {
    code: 200,
    message: '登录成功',
    data: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    }
  }
}

// 获取用户信息
export const getUserInfo = () => {
  return {
    code: 200,
    data: {
      name: '管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      roles: ['admin'],
      permissions: ['*']
    }
  }
}

// 获取路由菜单
export const getRoutes = () => {
  return {
    code: 200,
    data: [
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: '/system/user',
            name: 'User',
            meta: { title: '用户管理' },
            component: '/system/user' // 👈 必须加
          },
          {
            path: '/system/role',
            name: 'Role',
            meta: { title: '角色管理' },
            component: '/system/role' // 👈 必须加
          },
          {
            path: '/system/menu',
            name: 'Menu',
            meta: { title: '菜单管理' },
            component: '/system/menu' // 👈 必须加
          }
        ]
      }
    ]
  }
}

// ========== 新增：用户管理接口 ==========
const userList = Mock.mock({
  'records|25': [
    {
      id: '@increment',
      username: '@cname',
      nickname: '@cname',
      email: '@email',
      phone: /1[3-9]\d{9}/,
      status: '@pick([0,1])', // 0禁用 1正常
      createTime: '@datetime'
    }
  ],
  total: 25
})

// 用户列表
export const getUserList = () => ({ code: 200, data: userList })
// 新增用户
export const addUser = () => ({ code: 200, message: '新增成功' })
// 编辑用户
export const editUser = () => ({ code: 200, message: '编辑成功' })
// 删除用户
export const delUser = () => ({ code: 200, message: '删除成功' })
// 批量删除
export const batchDelUser = () => ({ code: 200, message: '批量删除成功' })
// 重置密码
export const resetPwd = () => ({ code: 200, message: '密码重置成功' })

// ========== 新增：角色管理接口 ==========
const roleList = Mock.mock({
  'records|8': [
    {
      id: '@increment',
      roleName: '@ctitle(3,6)',
      roleKey: 'role_@lower(3)',
      sort: '@integer(1,20)',
      status: '@pick([0,1])',
      createTime: '@datetime'
    }
  ],
  total: 8
})
export const getRoleList = () => ({ code: 200, data: roleList })
export const addRole = () => ({ code: 200, message: '角色新增成功' })
export const editRole = () => ({ code: 200, message: '角色编辑成功' })
export const delRole = () => ({ code: 200, message: '角色删除成功' })

// ========== 新增：菜单管理接口（树形） ==========
const menuList = [
  { id: 1, parentId: 0, menuName: '系统管理', path: '/system', sort: 1, status: 1 },
  { id: 2, parentId: 1, menuName: '用户管理', path: '/system/user', sort: 2, status: 1 },
  { id: 3, parentId: 1, menuName: '角色管理', path: '/system/role', sort: 3, status: 1 }
]
export const getMenuList = () => ({ code: 200, data: { records: menuList, total: 3 } })
export const addMenu = () => ({ code: 200, message: '菜单新增成功' })
export const editMenu = () => ({ code: 200, message: '菜单编辑成功' })
export const delMenu = () => ({ code: 200, message: '菜单删除成功' })

// ========== 新增：字典管理接口 ==========
const dictList = Mock.mock({
  'records|6': [
    {
      id: '@increment',
      dictName: '@ctitle(4,8)',
      dictType: 'dict_@lower(4)',
      status: '@pick([0,1])',
      createTime: '@datetime'
    }
  ],
  total: 6
})
export const getDictList = () => ({ code: 200, data: dictList })
export const addDict = () => ({ code: 200, message: '字典新增成功' })
export const editDict = () => ({ code: 200, message: '字典编辑成功' })
export const delDict = () => ({ code: 200, message: '字典删除成功' })
