<template>
  <div class="base-search">
    <el-form :model="searchParams" inline @submit.prevent="handleSearch">
      <el-form-item v-for="item in searchItems" :key="item.prop" :label="item.label">
        <el-input
          v-if="item.type === 'input'"
          v-model="searchParams[item.prop]"
          :placeholder="item.placeholder || `请输入${item.label}`"
          clearable
        />
        <el-select
          v-else-if="item.type === 'select'"
          v-model="searchParams[item.prop]"
          :placeholder="item.placeholder || `请选择${item.label}`"
          clearable
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="searchParams[item.prop]"
          type="date"
          :placeholder="item.placeholder || `请选择${item.label}`"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'
import type { SearchItem } from '@/types/components'

const props = defineProps<{
  searchParams: Record<string, any>
  searchItems: SearchItem[]
}>()

const emit = defineEmits<{
  search: []
  reset: []
}>()

const handleSearch = () => emit('search')
const handleReset = () => emit('reset')
</script>

<style scoped>
.base-search {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
