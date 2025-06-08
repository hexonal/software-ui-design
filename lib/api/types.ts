// API 响应类型 - 与Java后端Result<T>结构保持一致
export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
  success?: boolean // 可选字段，前端计算得出
  originalData?: any // 可选字段，用于调试，保留原始响应数据
}

// 登录请求参数
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应数据（JWT Token）
export interface LoginResponse {
  token: string
  userInfo?: {
    id: number
    username: string
    email: string
    role: string
    roleId: number
    status: string
    lastLogin: string
  }
}

// 分页请求参数
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应数据
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 通用查询参数
export interface QueryParams {
  search?: string
  filter?: Record<string, any>
  [key: string]: any
}

// 错误响应
export interface ApiError {
  code: string
  message: string
  details?: any
}

// 系统状态相关类型
export interface StatusItem {
  value: string
  description: string
  status: 'success' | 'warning' | 'error' | 'default'
}

export interface SystemStatusResponse {
  health: StatusItem
  storage: StatusItem
  nodes: StatusItem
  databases: StatusItem
}