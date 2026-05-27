// 1. 导入依赖包（核心库、插件、样式、组件）
import { createApp } from 'vue' // 从Vue3中导入「创建应用实例」的方法
import App from './App.vue' // 导入项目的【根组件】（所有页面的最外层容器）
import router from './router' // 导入路由配置（管理页面跳转）
import pinia from './store' // 导入状态管理（存储全局共享数据）
import ElementPlus from 'element-plus' // 导入Element Plus UI组件库
import 'element-plus/dist/index.css' // 导入Element Plus的【默认样式】
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入Element Plus所有图标
import './styles/index.css' // 导入【项目自定义全局样式】
// 2. 创建Vue应用实例,指定根组件是 App.vue
const app = createApp(App)

// 3.全局注册Element Plus图标
//一次性把所有图标注册为全局组件 , 在项目任意页面 / 组件中，直接用 <图标名/> 即可，无需单独导入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 4. 开发环境启用 mock
if (import.meta.env.DEV) {
  import('./mock')
}

// 5. 安装全局插件（Vue3固定用法：app.use(插件)）
app.use(pinia) // 安装状态管理Pinia
app.use(router) // 安装路由Router
app.use(ElementPlus) // 安装Element Plus UI库

// 6. 挂载应用到页面DOM节点
app.mount('#app')
