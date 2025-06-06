import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { Database } from '@/lib/types'

// 获取关系型数据库列表
export const getRelationalDatabases = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/database/relational', { params })
}

// 获取关系型数据库详情
export const getRelationalDatabaseById = async (id: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/relational/${id}`)
}

// 创建关系型数据库
export const createRelationalDatabase = async (data: any): Promise<ApiResponse<any>> => {
  return api.post('/dfm/database/relational', data)
}

// 执行 SQL 查询
export const executeSQLQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/relational/${databaseId}/query`, { query })
}

// 获取关系型数据库表列表
export const getRelationalTables = async (databaseId: string, params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/database/relational/${databaseId}/tables`, { params })
}

// 创建关系型数据库表
export const createRelationalTable = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/relational/${databaseId}/tables`, data)
}