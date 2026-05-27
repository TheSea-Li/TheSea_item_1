// 全局注册组件 完全无TS报错
import type { App } from 'vue'
import BaseSearch from './BaseSearch/index.vue'
import BaseTable from './BaseTable/index.vue'
import BaseForm from './BaseForm/index.vue'

export default {
  install(app: App) {
    // 手动注册固定组件名，企业级标准写法
    app.component('BaseSearch', BaseSearch)
    app.component('BaseTable', BaseTable)
    app.component('BaseForm', BaseForm)
  }
}
