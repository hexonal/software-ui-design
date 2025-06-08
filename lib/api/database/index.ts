import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { Database, Table } from '@/lib/types'

// 导入子模块
import * as relationalApi from './relational'

// 获取所有数据库
export const getDatabases = async (params?: QueryParams): Promise<ApiResponse<Database[]>> => {
  return api.get('/dfm/database', { params })
}

// 获取数据库详情
export const getDatabaseById = async (id: string): Promise<ApiResponse<Database | null>> => {
  return api.get(`/dfm/database/${id}`)
}

// 创建数据库
export const createDatabase = async (data: Omit<Database, 'id'>): Promise<ApiResponse<Database>> => {
  return api.post('/dfm/database', data)
}

// 更新数据库
export const updateDatabase = async (id: string, data: Partial<Database>): Promise<ApiResponse<Database | null>> => {
  return api.put(`/dfm/database/${id}`, data)
}

// 删除数据库
export const deleteDatabase = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/database/${id}`)
}

// 获取所有表
export const getTables = async (params?: QueryParams): Promise<ApiResponse<Table[]>> => {
  return api.get('/dfm/database/tables', { params })
}

// 获取表详情
export const getTableByName = async (databaseId: string, tableName: string): Promise<ApiResponse<Table | null>> => {
  return api.get(`/dfm/database/${databaseId}/tables/${tableName}`)
}

// 创建表
export const createTable = async (databaseId: string, data: Omit<Table, 'database'>): Promise<ApiResponse<Table>> => {
  return api.post(`/dfm/database/${databaseId}/tables`, data)
}

// 更新表
export const updateTable = async (databaseId: string, tableName: string, data: Partial<Table>): Promise<ApiResponse<Table | null>> => {
  return api.put(`/dfm/database/${databaseId}/tables/${tableName}`, data)
}

// 删除表
export const deleteTable = async (databaseId: string, tableName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/database/${databaseId}/tables/${tableName}`)
}

// 执行 SQL 查询
export const executeQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/${databaseId}/query`, { query })
}

// 导出子模块
export { relationalApi }

// ==================== 数据库概览相关API ====================

/**
 * 获取数据库概览统计信息
 */
export async function getDatabaseOverviewStats() {
  try {
    const response = await api.post('/dfm/database/overview/stats', {})
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || '获取数据库统计信息成功'
    }
  } catch (error) {
    console.error('获取数据库统计信息失败:', error)
    return {
      success: false,
      data: null,
      message: '获取数据库统计信息失败'
    }
  }
}

/**
 * 获取数据库类型分布数据
 */
export async function getDatabaseTypesDistribution() {
  try {
    const response = await api.post('/dfm/database/overview/types-distribution', {})
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || '获取数据库类型分布成功'
    }
  } catch (error) {
    console.error('获取数据库类型分布失败:', error)
    return {
      success: false,
      data: null,
      message: '获取数据库类型分布失败'
    }
  }
}

/**
 * 获取数据库存储容量数据
 */
export async function getDatabaseStorageData() {
  try {
    const response = await api.post('/dfm/database/overview/storage-data', {})
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || '获取数据库存储数据成功'
    }
  } catch (error) {
    console.error('获取数据库存储数据失败:', error)
    return {
      success: false,
      data: null,
      message: '获取数据库存储数据失败'
    }
  }
}