<template>
  <div class="menu-page">
    <div style="margin: 16px 0">
      <el-button type="primary" @click="openDialog">
        <el-icon><Plus /></el-icon>新增菜单
      </el-button>
    </div>

    <BaseTable
      :data-list="dataList"
      :loading="loading"
      :pagination="pagination"
      :columns="tableColumns"
      :show-index="false"
      :show-selection="false"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <el-dialog v-model="dialogVisible" title="菜单编辑" width="500px">
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
import { getMenuList, addMenu, editMenu, delMenu } from '@/api/system/menu'
// 引入全局类型定义（核心修复）
import type { TableColumn, FormItem } from '@/types/components'

// 表格逻辑
const { dataList, loading, pagination, handleSearch, handlePageChange, handleSizeChange } =
  useTable({ apiFn: getMenuList })

// ：声明TableColumn类型，移除reactive
const tableColumns: TableColumn[] = [
  { prop: 'menuName', label: '菜单名称' },
  { prop: 'path', label: '路由地址' },
  { prop: 'parentId', label: '父级ID' },
  { prop: 'sort', label: '排序' },
  { label: '操作', slot: 'operation', width: 200 }
]

// 表单弹窗
const dialogVisible = ref(false)
const baseFormRef = ref()
const isEdit = ref(false)
const editId = ref(0)

const initForm = { menuName: '', path: '', parentId: 0, sort: 1 }
// 修复formLoading不存在报错
const { formData, loading: formLoading, handleSubmit, handleReset: formReset } = useForm(initForm)

// 声明FormItem类型，移除reactive
const formItems: FormItem[] = [
  { prop: 'menuName', label: '菜单名称', type: 'input' },
  { prop: 'path', label: '路由地址', type: 'input' },
  { prop: 'parentId', label: '父级ID', type: 'input' },
  { prop: 'sort', label: '排序', type: 'input' }
]

//补全表单校验规则
const formRules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
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
      await editMenu({ id: editId.value, ...formData })
    } else {
      await addMenu(formData)
    }
    dialogVisible.value = false
    handleSearch()
  })
}

// 删除
const handleDel = async (row: any) => {
  await ElMessageBox.confirm('确定删除菜单？', '提示')
  await delMenu(row.id)
  ElMessage.success('删除成功')
  handleSearch()
}
</script>

<style scoped>
.menu-page {
  padding: 0 10px;
}
</style>
