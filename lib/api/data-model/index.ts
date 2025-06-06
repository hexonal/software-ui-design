import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

// 获取表结构
export const getTableStructure = async (databaseId: string, tableName: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/data-model/tables/${databaseId}/${tableName}/structure`)
}

// 创建表
export const createTable = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/tables/${databaseId}`, data)
}

// 修改表结构
export const alterTable = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  return api.put(`/dfm/data-model/tables/${databaseId}/${tableName}`, data)
}

// 删除表
export const dropTable = async (databaseId: string, tableName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/data-model/tables/${databaseId}/${tableName}`)
}

// 获取表索引
export const getTableIndexes = async (databaseId: string, tableName: string): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes`)
}

// 创建索引
export const createIndex = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes`, data)
}

// 删除索引
export const dropIndex = async (databaseId: string, tableName: string, indexName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes/${indexName}`)
}

// 导入数据
export const importData = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/import/${databaseId}/${tableName}`, data)
}

// 导出数据
export const exportData = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/export/${data.databaseId}`, data)
}

// 获取导入导出任务列表
export const getImportExportTasks = async (): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/data-model/tasks')
}