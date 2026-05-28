<template>
  <div class="role-page">
    <BaseSearch
      :search-params="searchParams"
      :search-items="searchItems"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="btn-wrap" style="margin: 16px 0">
      <el-button type="primary" @click="openDialog">
        <el-icon><Plus /></el-icon>新增角色
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

    <el-dialog v-model="dialogVisible" title="角色编辑" width="500px">
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
import { getRoleList, addRole, editRole, delRole } from '@/api/system/role'
// 引入全局类型
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
} = useTable({ apiFn: getRoleList })

// ：声明 SearchItem 类型，移除 reactive
const searchItems: SearchItem[] = [{ prop: 'roleName', label: '角色名称', type: 'input' }]

// 声明 TableColumn 类型，移除 reactive
const tableColumns: TableColumn[] = [
  { prop: 'roleName', label: '角色名称' },
  { prop: 'roleKey', label: '角色标识' },
  { prop: 'sort', label: '排序' },
  { prop: 'status', label: '状态' },
  { prop: 'createTime', label: '创建时间' },
  { label: '操作', slot: 'operation', width: 200 }
]

// 弹窗表单
const dialogVisible = ref(false)
const baseFormRef = ref()
const isEdit = ref(false)
const editId = ref(0)

const initForm = { roleName: '', roleKey: '', sort: 1, status: 1 }
// ：useForm 返回 loading，重命名为 formLoading
const { formData, loading: formLoading, handleSubmit, handleReset: formReset } = useForm(initForm)

//：声明 FormItem 类型，移除 reactive
const formItems: FormItem[] = [
  { prop: 'roleName', label: '角色名称', type: 'input' },
  { prop: 'roleKey', label: '角色标识', type: 'input' },
  { prop: 'sort', label: '排序', type: 'input' }
]

const formRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
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
      await editRole({ id: editId.value, ...formData })
    } else {
      await addRole(formData)
    }
    dialogVisible.value = false
    handleSearch()
  })
}

// 删除
const handleDel = async (row: any) => {
  await ElMessageBox.confirm('确定删除该角色？', '提示')
  await delRole(row.id)
  ElMessage.success('删除成功')
  handleSearch()
}
</script>

<style scoped>
.role-page {
  padding: 0 10px;
}
</style>
