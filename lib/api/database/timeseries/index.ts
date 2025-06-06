import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

// 获取时序数据库列表
export const getTimeseriesDatabases = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/database/timeseries', { params })
}

// 获取时序数据库详情
export const getTimeseriesDatabaseById = async (id: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/timeseries/${id}`)
}

// 创建时序数据库
export const createTimeseriesDatabase = async (data: any): Promise<ApiResponse<any>> => {
  return api.post('/dfm/database/timeseries', data)
}

// 获取时间序列列表
export const getTimeseries = async (databaseId: string, params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/database/timeseries/${databaseId}/series`, { params })
}

// 创建时间序列
export const createTimeseries = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/timeseries/${databaseId}/series`, data)
}

// 删除时间序列
export const deleteTimeseries = async (databaseId: string, seriesName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/database/timeseries/${databaseId}/series/${seriesName}`)
}

// 执行时序查询
export const executeTimeseriesQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/timeseries/${databaseId}/query`, { query })
}

// 创建保留策略
export const createRetentionPolicy = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/timeseries/${databaseId}/retention-policies`, data)
}

// 获取保留策略列表
export const getRetentionPolicies = async (databaseId: string): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/database/timeseries/${databaseId}/retention-policies`)
}

// 获取时序数据库性能指标
export const getTimeseriesDatabaseMetrics = async (databaseId: string, timeRange: string = "24h"): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/timeseries/${databaseId}/metrics`, { params: { timeRange } })
}