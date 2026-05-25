import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

// 静态路由：所有人都能访问
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  }
]

// 动态路由：需要权限才能访问
export const asyncRoutes = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 有token
  if (userStore.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断是否已经获取了用户信息
      if (userStore.roles.length === 0) {
        try {
          // 获取用户信息
          await userStore.getUserInfo()
          // 根据用户权限生成可访问的路由
          const accessRoutes = await permissionStore.generateRoutes(userStore.roles)
          // 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，重置token并跳转到登录页
          await userStore.resetToken()
          ElMessage.error('获取用户信息失败，请重新登录')
          next(`/login?redirect=${to.path}`)
        }
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (['/login'].includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
