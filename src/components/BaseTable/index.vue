<template>
  <div class="base-table">
    <el-table
      v-loading="loading"
      :data="dataList"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelection"
    >
      <!-- 多选框 -->
      <el-table-column v-if="showSelection" type="selection" width="55" align="center" />

      <!-- 序号 -->
      <el-table-column v-if="showIndex" label="序号" width="70" align="center">
        <template #default="scope">
          {{ (pagination.pageNum - 1) * pagination.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 动态列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :align="column.align || 'center'"
      >
        <template #default="scope">
          <!-- 自定义渲染 -->
          <slot v-if="column.slot" :name="column.slot" :row="scope.row" />
          <!-- 普通文本 -->
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column v-if="showOperation" label="操作" width="180" align="center" fixed="right">
        <template #default="scope">
          <slot name="operation" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="pagination.total > 0"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="pagination.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/types/components'
import type { PaginationParams } from '@/types/table'

const props = defineProps<{
  dataList: any[]
  loading: boolean
  pagination: PaginationParams
  columns: TableColumn[]
  showSelection?: boolean
  showIndex?: boolean
  showOperation?: boolean
}>()

const emit = defineEmits(['pageChange', 'sizeChange', 'selectionChange'])

const handlePageChange = (page: number) => emit('pageChange', page)
const handleSizeChange = (size: number) => emit('sizeChange', size)
const handleSelection = (val: any[]) => emit('selectionChange', val)
</script>

<style scoped>
.base-table {
  background: #fff;
  border-radius: 4px;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
