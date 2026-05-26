import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { getRoutes } from '@/api/system/menu'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'

// 扩展路由元信息
interface CustomMeta extends RouteMeta {
  title?: string
  icon?: string
  hidden?: boolean
}

// 后端菜单类型
interface MenuItem {
  path: string
  name?: string
  component?: string
  meta?: CustomMeta
  children?: MenuItem[]
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as RouteRecordRaw[],
    asyncRoutes: [] as RouteRecordRaw[]
  }),

  actions: {
    async generateRoutes() {
      const { data } = await getRoutes()
      const asyncRoutes = this.convertRoutes(data as MenuItem[])

      this.asyncRoutes = asyncRoutes
      this.routes = [...constantRoutes, ...asyncRoutes]
      return asyncRoutes
    },

    convertRoutes(routes: MenuItem[]): RouteRecordRaw[] {
      const modules = import.meta.glob('@/views/**/*.vue')
      const Layout = () => import('@/layout/index.vue')

      return routes.map((item) => {
        // 1. 一级菜单（父路由）：使用布局组件
        if (item.children && item.children.length > 0) {
          return {
            path: item.path,
            name: item.name,
            meta: item.meta,
            component: Layout,
            children: this.convertRoutes(item.children)
          } as RouteRecordRaw
        }

        // 2. 二级菜单（页面路由）：使用页面组件，children 为 undefined
        return {
          path: item.path,
          name: item.name,
          meta: item.meta,
          component: modules[`/src/views${item.component!}.vue`]
        } as RouteRecordRaw
      })
    }
  }
})
