<template>
  <!-- 最外层容器：整个登录页面的布局 -->
  <div class="login-container">
    <!-- 登录盒子：白色的表单区域 -->
    <div class="login-box">
      <!-- 页面标题：从环境变量读取的系统名称 -->
      <h2 class="login-title">{{ title }}</h2>

      <!-- Element Plus 表单核心组件 -->
      <!-- ref="loginFormRef"   绑定表单实例，用来做表单校验 -->
      <!-- :model="loginForm" 绑定表单数据对象 -->
      <!-- :rules="loginRules"   绑定表单校验规则 -->
      <!-- label-width="0px" 隐藏表单标签 -->

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-width="0px"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <!-- prop对应校验字段 -->
          <!-- v-model="loginForm.username" 双向绑定用户名 -->
          <!-- prefix-icon="User"  左侧用户图标 -->
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <!-- type="password"" 密码隐藏显示 -->
          <!--  prefix-icon="Lock"  左侧锁图标 -->
          <!--   @keyup.enter="handleLogin"  回车触发登录 -->
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <!--   type="primary"  主题色按钮 -->
          <!--   :loading="loading"  加载状态：请求时按钮禁用+转圈 -->
          <!--   @click="handleLogin"  点击触发登录 -->
          <el-button
            type="primary"
            class="login-btn"
            size="large"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. 导入依赖
import { useUserStore } from '@/store/modules/user' // 导入Pinia用户仓库（登录、token）
import { useRouter, useRoute } from 'vue-router' // 导入路由：跳转、获取参数
import { ref, reactive } from 'vue' // 导入Vue3响应式API

// 2. 初始化实例
const userStore = useUserStore() // 创建用户仓库实例（调用登录方法）
const router = useRouter() // 路由实例（页面跳转）
const route = useRoute() // 当前路由实例（获取跳转前的地址）

// 3. 环境变量：系统标题（来自根目录 .env 文件）
const title = import.meta.env.VITE_APP_TITLE

// 4. 响应式数据
//ref创建一个响应式数据引用
//接收一个内部值（初始值），返回一个响应式对象
//这个对象只有一个 .value 属性，指向内部值
// 按钮加载状态：请求时true，结束false
const loading = ref(false)
// 绑定ElForm表单实例：用于调用表单校验方法
const loginFormRef = ref()

// 表单数据对象：双向绑定输入框
//reactive创建一个响应式对象
//接收一个普通对象，返回该对象的响应式代理
//不需要 .value，直接访问属性
const loginForm = reactive({
  username: 'admin', // 默认用户名
  password: '123456' // 默认密码
})

// 表单校验规则：用户名/密码必填
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 5. 核心方法：登录逻辑
const handleLogin = async () => {
  console.log('点击触发登录')

  // 如果表单实例不存在，直接返回
  if (!loginFormRef.value) return
  // 执行表单校验（不满足规则会报错）
  await loginFormRef.value.validate()

  try {
    // 开启加载状态：按钮禁用+转圈
    loading.value = true
    // 调用Pinia仓库的登录方法（发送登录请求、存储token）
    await userStore.login(loginForm)
    // 登录成功后：跳转到首页 / 重定向地址
    const redirect = route.query.redirect || '/'
    console.log('redirect的值：', redirect)

    router.push(redirect as string)
  } catch (error) {
    // 登录失败：打印错误
    console.error(error)
  } finally {
    // 无论成功/失败：关闭加载状态
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background-color: #2b4b6b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-btn {
  width: 100%;
}
</style>
