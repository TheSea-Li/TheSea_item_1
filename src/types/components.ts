// 问题：TS 没有给循环项、组件入参做类型定义，Vue + TS 严格模式下数组项默认推断为 unknown
// 统一定义搜索项、表单项、表格列的 TS 接口，后续所有通用组件都复用这里的类型。

/** 下拉选项通用类型 */
export interface OptionItem {
  label: string
  value: string | number
}

/** 搜索栏每一项配置 */
export interface SearchItem {
  prop: string
  label: string
  type: 'input' | 'select' | 'date'
  placeholder?: string
  options?: OptionItem[]
}

/** 表格列配置 */
export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  slot?: string
}

/** 表单项配置 */
export interface FormItem {
  prop: string
  label: string
  type: 'input' | 'password' | 'select' | 'textarea'
  placeholder?: string
  options?: OptionItem[]
  disabled?: boolean
}
