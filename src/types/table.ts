// 分页参数类型
export interface PaginationParams {
  pageNum: number
  pageSize: number
  [key: string]: any
}

// 表格 Hook 配置类型
export interface UseTableOptions {
  apiFn: (params: any) => Promise<any>
  defaultParams?: Record<string, any>
  immediate?: boolean
}
