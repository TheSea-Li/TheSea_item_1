// vite.config.ts 整个项目的构建配置文件
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Element Plus自动导入，不用每个页面都import
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ],
  resolve: {
    //配置路径别名，以后道路文件不用写../../了
    alias: {
      '@': resolve(__dirname, './src'),
      '@api': resolve(__dirname, './src/api'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@store': resolve(__dirname, './src/store')
    }
  },
  server: {
    port: 3000, // 改成3000端口，和后端常用端口区分
    open: true // 启动后自动打开浏览器
    // proxy: {
    //   // 配置代理，解决跨域问题
    //   '/api': {
    //     target: 'http://localhost:8080', //后端接口地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  build: {
    rollupOptions: {
      output: {
        // 修复：manualChunks 改为【函数写法】（解决TS类型报错）
        manualChunks(id: string) {
          // 打包 Vue 生态依赖
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia')
          ) {
            return 'vue'
          }
          // 打包 Element Plus
          if (id.includes('node_modules/element-plus')) {
            return 'elementPlus'
          }
        }
      }
    }
  }
})
