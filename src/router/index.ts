import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { ElMessage } from 'element-plus'

// 静态路由：所有人都能访问
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  // 新增：根路径 / 对应的配置（核心！）
  {
    path: '/',
    component: () => import('@/layout/index.vue'), // 布局组件（后台外壳）
    redirect: '/home', // 访问 / 自动跳转到 /home
    meta: { hidden: true },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'), // 首页页面
        name: 'Home',
        meta: { title: '首页', icon: 'Home' }
      }
    ]
  }
]

// 动态路由：需要权限才能访问
export const asyncRoutes = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layout/index.vue'),
    meta: { title: '系统管理', icon: 'Setting' },
    redirect: '/system/user',
    children: [
      {
        path: '/system/user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/system/role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: '/system/menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// 路由守卫
// 这三个参数，是路由跳转前，Vue自动塞进来的！
// to	你要去哪里（目标路由对象）
// from	你从哪里来（当前页面路由对象）
// next	放行 / 跳转函数
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (userStore.token) {
    console.log('路由111')
    // 已登录，访问登录页 → 跳首页
    if (to.path === '/login') {
      next('/')
    } else {
      console.log('userStore的值：', userStore)

      // 未获取用户信息 → 先获取
      if (userStore.roles.length === 0) {
        try {
          const data = await userStore.getUserInfo()
          //  修复：无参调用（匹配permission.ts定义）
          const accessRoutes = await permissionStore.generateRoutes()
          // 动态添加路由
          accessRoutes.forEach((route) => router.addRoute(route))
          next(to.fullPath)
        } catch (error) {
          //  修复：调用 logout 而非 resetToken
          await userStore.logout()
          ElMessage.error('登录已过期，请重新登录')
          next(`/login?redirect=${to.path}`)
        }
      } else {
        next()
      }
    }
  } else {
    console.log('路由222')
    // 未登录 → 只放行登录页
    if (to.path === '/login') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
