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
    children: [
      {
        path: 'home',
        component: () => import('@/layout/index.vue'), // 首页页面
        name: 'Home',
        meta: { title: '首页', icon: 'Home' }
      }
    ]
  }
]

// 动态路由：需要权限才能访问
export const asyncRoutes = []

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
      //next() 是 Vue Router 路由守卫的「放行指令」.它是一个必须调用的函数，不调用路由会直接卡死.作用：告诉路由「可以继续跳转了」
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
