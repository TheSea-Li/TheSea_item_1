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
