import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'
import { useUserStore } from './user'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/types/system' // 复用统一类型

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    // 最终完整路由
    fullRoutes: [] as RouteRecordRaw[],
    // 动态添加的路由
    addRoutes: [] as RouteRecordRaw[]
  }),

  actions: {
    /** 生成权限路由（核心修复） */
    async generateRoutes() {
      const userStore = useUserStore()

      // 1. 模拟：管理员获取所有动态路由
      let accessedRoutes: RouteRecordRaw[] = []
      if (userStore.roles.includes('admin')) {
        accessedRoutes = asyncRoutes
      }

      // 2. 如果你用【后端返回菜单】，就打开这段（替换上面）
      // const res = await getMenuList()
      // accessedRoutes = this.convertRoutes(res.data)

      // 3. 添加404兜底路由（必须！）
      accessedRoutes.push({
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        meta: { hidden: true }
      })

      // 4. 赋值
      this.addRoutes = accessedRoutes
      // 5. 合并静态路由 + 动态路由（完整路由）
      this.fullRoutes = [...constantRoutes, ...accessedRoutes]

      return accessedRoutes
    },

    /** 后端菜单 转 前端路由（修复路径/重定向） */
    convertRoutes(menus: MenuItem[]): RouteRecordRaw[] {
      // 批量导入页面组件
      const modules = import.meta.glob('@/views/**/*.vue')
      // 布局组件
      const Layout = () => import('@/layout/index.vue')

      return menus.map((menu) => {
        const route: any = {
          path: menu.path,
          name: menu.menuName?.replace(/\s+/g, '') || '',
          meta: {
            title: menu.menuName,
            icon: menu.icon,
            hidden: menu.status === 0
          }
        }

        // 1. 一级菜单 / 目录
        if (menu.children && menu.children.length > 0) {
          route.component = Layout
          // 默认重定向到第一个子路由
          route.redirect = `${menu.path}/${menu.children[0].path}`
          route.children = this.convertRoutes(menu.children)
        } else {
          // 2. 二级页面（修复路径拼接！）
          const componentPath = `/src/views/${menu.component}.vue`
          route.component = modules[componentPath] || modules['/src/views/404/index.vue']
        }

        return route as RouteRecordRaw
      })
    },

    /** 重置路由（退出登录用） */
    resetRoutes() {
      this.addRoutes = []
      this.fullRoutes = []
    }
  }
})
