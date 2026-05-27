// 功能：自动处理分页、搜索、重置、loading、接口请求，一行代码复用所有表格逻辑
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { PaginationParams, UseTableOptions } from '@/types/table'

export function useTable<T = any>(options: UseTableOptions) {
  const { apiFn, defaultParams = {}, immediate = true } = options

  // 表格数据
  const dataList = ref<T[]>([])
  // 加载状态
  const loading = ref(false)
  // 分页信息
  const pagination = reactive<PaginationParams>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    ...defaultParams
  })

  // 查询参数（搜索条件）
  const searchParams = reactive<Record<string, any>>({ ...defaultParams })

  // 获取数据
  const getList = async () => {
    if (!apiFn) return
    loading.value = true
    try {
      const params = { ...pagination, ...searchParams }
      const res = await apiFn(params)
      dataList.value = res.data.records || res.data.list || []
      pagination.total = res.data.total || 0
    } catch (error) {
      ElMessage.error('数据加载失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.pageNum = 1
    getList()
  }

  // 重置
  const handleReset = () => {
    Object.keys(searchParams).forEach((key) => {
      searchParams[key] = defaultParams[key] || ''
    })
    pagination.pageNum = 1
    getList()
  }

  // 页码改变
  const handlePageChange = (page: number) => {
    pagination.pageNum = page
    getList()
  }

  // 每页条数改变
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    getList()
  }

  // 立即加载
  onMounted(() => {
    immediate && getList()
  })

  return {
    dataList,
    loading,
    pagination,
    searchParams,
    getList,
    handleSearch,
    handleReset,
    handlePageChange,
    handleSizeChange
  }
}
