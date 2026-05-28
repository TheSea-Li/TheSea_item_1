<template>
  <div class="app-wrapper">
    <el-container class="app-container">
      <!-- 侧边栏 -->
      <el-aside width="220px" class="sidebar">
        <div class="logo-container">
          <h2 class="logo-title">{{ title }}</h2>
        </div>
        <el-menu :default-active="$route.path" router mode="vertical" class="sidebar-menu">
          <template v-for="item in menuList" :key="item.path">
            <!-- 一级菜单：无子节点 -->
            <el-menu-item v-if="!item.children" :index="item.path">
              <el-icon><component :is="item.meta?.icon" /></el-icon>
              <span>{{ item.meta?.title }}</span>
            </el-menu-item>
            <!-- 二级菜单：有子节点 -->
            <el-sub-menu v-else :index="item.path">
              <template #title>
                <el-icon><component :is="item.meta?.icon" /></el-icon>
                <span>{{ item.meta?.title }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                {{ child.meta?.title }}
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-left">
            <el-button type="text" icon="Expand" @click="toggleSidebar" />
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :src="userStore.avatar" />
                {{ userStore.name }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 页面内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

// 路由实例
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const title = import.meta.env.VITE_APP_TITLE
// 修复：过滤隐藏菜单 + 可选链，解决TS报错
const menuList = computed<RouteRecordRaw[]>(() =>
  permissionStore.fullRoutes.filter((item: RouteRecordRaw) => !item.meta?.hidden)
)
console.log('menuList:', menuList)

const toggleSidebar = () => {
  // 后续实现侧边栏折叠功能
}

// 退出登录
const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await userStore.logout()
      router.push('/login')
    })
  }
}
</script>

<style scoped>
.app-wrapper {
  height: 100vh;
  width: 100%;
}

.app-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
}

.logo-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
