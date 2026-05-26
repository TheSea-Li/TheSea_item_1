import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/index.css'

const app = createApp(App)

// 全局注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 开发环境启用 mock
if (import.meta.env.DEV) {
  import('./mock')
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
