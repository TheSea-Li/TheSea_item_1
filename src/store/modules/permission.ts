import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'

interface PermissionState {
  routes: any[]
  addRoutes: any[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: []
  }),

  actions: {
    generateRoutes(roles: string[]) {
      return new Promise<any[]>((resolve) => {
        const accessedRoutes: any[] = roles.includes('admin') ? [] : []

        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})
