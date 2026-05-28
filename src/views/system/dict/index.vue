<template>
  <div class="dict-page">
    <BaseSearch
      :search-params="searchParams"
      :search-items="searchItems"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div style="margin: 16px 0">
      <el-button type="primary" @click="openDialog">
        <el-icon><Plus /></el-icon>新增字典
      </el-button>
    </div>

    <BaseTable
      :data-list="dataList"
      :loading="loading"
      :pagination="pagination"
      :columns="tableColumns"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <el-dialog v-model="dialogVisible" title="字典编辑" width="500px">
      <BaseForm
        :form-data="formData"
        :form-items="formItems"
        :rules="formRules"
        ref="baseFormRef"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useTable } from '@/hooks/useTable'
import { useForm } from '@/hooks/useForm'
import { getDictList, addDict, editDict, delDict } from '@/api/system/dict'
// 引入全局类型定义
import type { SearchItem, TableColumn, FormItem } from '@/types/components'

// 表格逻辑
const {
  dataList,
  loading,
  pagination,
  searchParams,
  handleSearch,
  handleReset,
  handlePageChange,
  handleSizeChange
} = useTable({ apiFn: getDictList })

// 声明类型，移除 reactive
const searchItems: SearchItem[] = [{ prop: 'dictName', label: '字典名称', type: 'input' }]

// 声明类型，移除 reactive
const tableColumns: TableColumn[] = [
  { prop: 'dictName', label: '字典名称' },
  { prop: 'dictType', label: '字典类型' },
  { prop: 'status', label: '状态' },
  { prop: 'createTime', label: '创建时间' },
  { label: '操作', slot: 'operation', width: 200 }
]

// 表单弹窗
const dialogVisible = ref(false)
const baseFormRef = ref()
const isEdit = ref(false)
const editId = ref(0)

const initForm = { dictName: '', dictType: '', status: 1 }
// 修复 formLoading 报错
const { formData, loading: formLoading, handleSubmit, handleReset: formReset } = useForm(initForm)

// 声明类型，移除 reactive
const formItems: FormItem[] = [
  { prop: 'dictName', label: '字典名称', type: 'input' },
  { prop: 'dictType', label: '字典类型', type: 'input' }
]

// 新增表单校验（优化项）
const formRules = {
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
}

// 打开弹窗
const openDialog = (row?: any) => {
  dialogVisible.value = true
  if (row) {
    isEdit.value = true
    editId.value = row.id
    Object.assign(formData, row)
  } else {
    isEdit.value = false
    formReset()
  }
}

// 提交表单
const submitForm = async () => {
  await handleSubmit(async () => {
    if (isEdit.value) {
      await editDict({ id: editId.value, ...formData })
    } else {
      await addDict(formData)
    }
    dialogVisible.value = false
    handleSearch()
  })
}

// 删除
const handleDel = async (row: any) => {
  await ElMessageBox.confirm('确定删除该字典？', '提示')
  await delDict(row.id)
  ElMessage.success('删除成功')
  handleSearch()
}
</script>

<style scoped>
.dict-page {
  padding: 0 10px;
}
</style>
