/// <reference types="vite/client" />

// 增强 ImportMeta 类型，解决 env 报错
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
