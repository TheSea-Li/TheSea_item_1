//功能：自动处理表单校验、提交、重置、新增 / 编辑状态
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 给 T 加约束：必须是 object 类型，解决 reactive 报错
export function useForm<T extends object = object>(initForm: T) {
  // 表单实例
  const formRef = ref()
  // 表单数据
  const formData = reactive<T>({ ...initForm })
  // 加载状态
  const loading = ref(false)

  // 表单提交
  const handleSubmit = async (callback: () => Promise<any>) => {
    if (!formRef.value) return
    await formRef.value.validate()
    try {
      loading.value = true
      await callback()
      ElMessage.success('操作成功')
      return true
    } catch (error) {
      ElMessage.error('操作失败')
      console.error(error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 表单重置
  const handleReset = () => {
    formRef.value?.resetFields()
    Object.assign(formData, initForm)
  }

  return {
    formRef,
    formData,
    loading,
    handleSubmit,
    handleReset
  }
}
