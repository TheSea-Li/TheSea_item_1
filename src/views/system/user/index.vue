<template>
  <div class="user-page">
    <!-- 搜索栏 -->
    <BaseSearch
      :search-params="searchParams"
      :search-items="searchItems"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 顶部按钮 -->
    <div class="btn-wrap" style="margin: 16px 0">
      <el-button type="primary" @click="openDialog">
        <el-icon><Plus /></el-icon>新增用户
      </el-button>
      <el-button type="danger" @click="handleBatchDel">
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
    </div>

    <!-- 表格 -->
    <BaseTable
      :data-list="dataList"
      :loading="loading"
      :pagination="pagination"
      :columns="tableColumns"
      show-selection
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @selection-change="handleSelection"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="用户编辑" width="600px">
      <BaseForm
        :form-data="formData"
        :form-items="formItems"
        :rules="formRules"
        ref="baseFormRef"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useTable } from '@/hooks/useTable'
import { useForm } from '@/hooks/useForm'
import { getUserList, addUser, editUser, delUser, batchDelUser } from '@/api/system/user'
// 引入类型
import type { SearchItem, FormItem, TableColumn } from '@/types/components'

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
} = useTable({ apiFn: getUserList })

// 选中项
const selectRows = ref<any[]>([])
const handleSelection = (val: any[]) => (selectRows.value = val)

//  修复1：声明 SearchItem 类型，替换 reactive 数组
const searchItems: SearchItem[] = [
  { prop: 'username', label: '用户名', type: 'input' },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '正常', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
]

//  修复2：声明 TableColumn 类型
const tableColumns: TableColumn[] = [
  { prop: 'username', label: '用户名' },
  { prop: 'nickname', label: '昵称' },
  { prop: 'email', label: '邮箱' },
  { prop: 'phone', label: '手机号' },
  { prop: 'status', label: '状态', slot: 'status' },
  { prop: 'createTime', label: '创建时间' },
  { label: '操作', slot: 'operation', width: 240 }
]

// 弹窗&表单
const dialogVisible = ref(false)
const baseFormRef = ref()
const isEdit = ref(false)
const editId = ref(0)

const initForm = { username: '', nickname: '', email: '', phone: '', status: 1 }
//  修复3：useForm 返回的是 loading，不是 formLoading
const { formData, loading: formLoading, handleSubmit, handleReset: formReset } = useForm(initForm)

//  修复4：声明 FormItem 类型
const formItems: FormItem[] = [
  { prop: 'username', label: '用户名', type: 'input' },
  { prop: 'nickname', label: '昵称', type: 'input' },
  { prop: 'email', label: '邮箱', type: 'input' },
  { prop: 'phone', label: '手机号', type: 'input' }
]

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
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
      await editUser({ id: editId.value, ...formData })
    } else {
      await addUser(formData)
    }
    dialogVisible.value = false
    handleSearch()
  })
}

// 删除单条
const handleDel = async (row: any) => {
  await ElMessageBox.confirm('确定删除该用户？', '提示')
  await delUser(row.id)
  ElMessage.success('删除成功')
  handleSearch()
}

// 批量删除
const handleBatchDel = async () => {
  if (!selectRows.value.length) return ElMessage.warning('请选择数据')
  await ElMessageBox.confirm('确定批量删除？', '提示')
  const ids = selectRows.value.map((item) => item.id)
  await batchDelUser(ids)
  ElMessage.success('批量删除成功')
  handleSearch()
}
</script>

<style scoped>
.user-page {
  padding: 0 10px;
}
</style>
