import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

// 获取系统设置
export const getSystemSettings = async (): Promise<ApiResponse<any>> => {
  return api.get('/dfm/system/settings')
}

// 更新系统设置
export const updateSystemSettings = async (data: any): Promise<ApiResponse<any>> => {
  return api.put('/dfm/system/settings', data)
}

// 修改管理员密码
export const changeAdminPassword = async (passwordData: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ApiResponse<any>> => {
  return api.post('/dfm/system/change-password', passwordData)
}

// 获取系统日志
export const getSystemLogs = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/logs', { params })
}

// 获取系统性能数据
export const getSystemPerformance = async (timeRange?: string): Promise<ApiResponse<any>> => {
  return api.get('/dfm/system/performance', { params: { timeRange } })
}

export const getSystemStatus = async (): Promise<ApiResponse<any>> => {
  return api.get('/dfm/system/status')
}

export const getSidebarNavItems = async (): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/sidebar-nav')
}

// 系统健康数据类型定义
export interface SystemHealthData {
  name: string
  cpu: number
  memory: number
  disk: number
  network: number
}

// 系统监控指标请求参数
export interface GetHealthMetricsRequest {
  timeRange?: string // '24h', '7d', '30d'
  interval?: string  // '1m', '5m', '1h', '1d'
  metrics?: string[] // ['cpu', 'memory', 'disk', 'network']
}

// 系统概览数据
export interface SystemOverviewData {
  totalNodes: number
  healthyNodes: number
  totalCpu: number
  totalMemory: number
  totalDisk: number
  activeConnections: number
  uptime: number
}

/**
 * 获取系统健康指标数据
 */
export async function getHealthMetrics(request: GetHealthMetricsRequest = {}) {
  try {
    const response = await api.post('/dfm/system/health/metrics', {
      timeRange: request.timeRange || '30d',
      interval: request.interval || '1d',
      metrics: request.metrics || ['cpu', 'memory', 'disk', 'network']
    })
    return {
      success: true,
      data: response.data.data as SystemHealthData[],
      message: response.data.message
    }
  } catch (error) {
    console.error('获取系统健康指标失败:', error)
    return {
      success: false,
      data: [],
      message: '获取系统健康指标失败'
    }
  }
}

/**
 * 获取系统概览数据
 */
export async function getSystemOverview() {
  try {
    const response = await api.post('/dfm/system/overview', {})
    return {
      success: true,
      data: response.data.data as SystemOverviewData,
      message: response.data.message
    }
  } catch (error) {
    console.error('获取系统概览失败:', error)
    return {
      success: false,
      data: null,
      message: '获取系统概览失败'
    }
  }
}

/**
 * 获取实时系统状态
 */
export async function getRealtimeStatus() {
  try {
    const response = await api.post('/dfm/system/realtime', {})
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('获取实时状态失败:', error)
    return {
      success: false,
      data: null,
      message: '获取实时状态失败'
    }
  }
}

/**
 * 获取性能历史数据
 */
export async function getPerformanceHistory(timeRange: string = '24h') {
  try {
    const response = await api.post('/dfm/system/performance/history', { timeRange })
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('获取性能历史数据失败:', error)
    return {
      success: false,
      data: [],
      message: '获取性能历史数据失败'
    }
  }
}

/**
 * 获取系统事件日志
 */
export async function getSystemEvents(params?: {
  level?: 'info' | 'warning' | 'error'
  timeRange?: string
  limit?: number
}) {
  try {
    const response = await api.post('/dfm/system/events', {
      level: params?.level || 'info',
      timeRange: params?.timeRange || '24h',
      limit: params?.limit || 100
    })
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    }
  } catch (error) {
    console.error('获取系统事件失败:', error)
    return {
      success: false,
      data: [],
      message: '获取系统事件失败'
    }
  }
}