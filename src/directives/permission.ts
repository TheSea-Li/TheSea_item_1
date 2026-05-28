import type { Directive } from 'vue'
import { useUserStore } from '@/store/modules/user'

// 权限指令 v-permission="sys:user:add"
export const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const permissions = userStore.permissions

    // 超级管理员 * 拥有所有权限
    if (permissions.includes('*')) return

    // 判断当前按钮权限是否在用户权限列表中
    const hasPerm = permissions.includes(binding.value)
    if (!hasPerm) {
      el.parentNode?.removeChild(el)
    }
  }
}
