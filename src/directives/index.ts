// src/directives/index.ts
import type { Directive } from 'vue'
import { permission } from './permission'

// 关键修复：给对象添加 TS 索引签名
const directives: Record<string, Directive> = {
  permission
}

export default {
  install(app: any) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}
