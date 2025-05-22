import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { Database, Table } from '@/mock/dashboard/types'

// 导入子模块
import * as relationalApi from './relational'

/**
 * @openapi
 * /database:
 *   get:
 *     summary: 获取所有数据库
 *     tags:
 *       - Database
 *     responses:
 *       200:
 *         description: 数据库列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Database'
 *             example:
 *               - id: "postgres-main"
 *                 name: "主数据库"
 *                 charset: "UTF-8"
 *                 collation: "en_US.UTF-8"
 *                 size: "1.2 TB"
 *                 tables: 42
 *               - id: "postgres-replica"
 *                 name: "副本数据库"
 *                 charset: "UTF-8"
 *                 collation: "en_US.UTF-8"
 *                 size: "1.1 TB"
 *                 tables: 42
 *               - id: "postgres-dev"
 *                 name: "开发数据库"
 *                 charset: "UTF-8"
 *                 collation: "en_US.UTF-8"
 *                 size: "800 GB"
 *                 tables: 38
 *               - id: "postgres-test"
 *                 name: "测试数据库"
 *                 charset: "UTF-8"
 *                 collation: "en_US.UTF-8"
 *                 size: "750 GB"
 *                 tables: 35
 *               - id: "postgres-analytics"
 *                 name: "分析数据库"
 *                 charset: "UTF-8"
 *                 collation: "en_US.UTF-8"
 *                 size: "2.1 TB"
 *                 tables: 28
 */
export const getDatabases = async (params?: QueryParams): Promise<ApiResponse<Database[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('databases') as Database[])
  }
  
  return api.get('/database', { params })
}

/**
 * @openapi
 * /database/{id}:
 *   get:
 *     summary: 获取数据库详情
 *     tags:
 *       - Database
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 数据库详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Database'
 *             example:
 *               id: "postgres-main"
 *               name: "主数据库"
 *               charset: "UTF-8"
 *               collation: "en_US.UTF-8"
 *               size: "1.2 TB"
 *               tables: 42
 */
export const getDatabaseById = async (id: string): Promise<ApiResponse<Database | null>> => {
  if (useMock()) {
    const databases = getMockData('databases') as Database[]
    const database = databases.find(db => db.id === id)
    
    if (!database) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(database)
  }
  
  return api.get(`/database/${id}`)
}

/**
 * @openapi
 * /database:
 *   post:
 *     summary: 创建数据库
 *     tags:
 *       - Database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Database'
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Database'
 *             example:
 *               id: "postgres-main"
 *               name: "主数据库"
 *               charset: "UTF-8"
 *               collation: "en_US.UTF-8"
 *               size: "1.2 TB"
 *               tables: 42
 */
export const createDatabase = async (data: Omit<Database, 'id'>): Promise<ApiResponse<Database>> => {
  if (useMock()) {
    // 模拟创建数据库
    const newDatabase: Database = {
      id: `db-${Date.now()}`,
      ...data
    }
    return mockResponse(newDatabase)
  }
  
  return api.post('/database', data)
}

/**
 * @openapi
 * /database/{id}:
 *   put:
 *     summary: 更新数据库
 *     tags:
 *       - Database
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Database'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Database'
 *             example:
 *               id: "postgres-main"
 *               name: "主数据库"
 *               charset: "UTF-8"
 *               collation: "en_US.UTF-8"
 *               size: "1.2 TB"
 *               tables: 42
 */
export const updateDatabase = async (id: string, data: Partial<Database>): Promise<ApiResponse<Database | null>> => {
  if (useMock()) {
    const databases = getMockData('databases') as Database[]
    const databaseIndex = databases.findIndex(db => db.id === id)
    
    if (databaseIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedDatabase = { ...databases[databaseIndex], ...data }
    return mockResponse(updatedDatabase)
  }
  
  return api.put(`/database/${id}`, data)
}

/**
 * @openapi
 * /database/{id}:
 *   delete:
 *     summary: 删除数据库
 *     tags:
 *       - Database
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteDatabase = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/database/${id}`)
}

/**
 * @openapi
 * /database/tables:
 *   get:
 *     summary: 获取所有表
 *     tags:
 *       - Database
 *     responses:
 *       200:
 *         description: 表列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 *             example:
 *               - name: "users"
 *                 database: "postgres-main"
 *                 type: "关系型"
 *                 fields: 12
 *                 rows: "1.2M"
 *                 size: "245 MB"
 *                 indexes: 3
 *               - name: "orders"
 *                 database: "postgres-main"
 *                 type: "关系型"
 *                 fields: 15
 *                 rows: "5.8M"
 *                 size: "1.2 GB"
 *                 indexes: 4
 *               - name: "products"
 *                 database: "postgres-main"
 *                 type: "关系型"
 *                 fields: 18
 *                 rows: "250K"
 *                 size: "180 MB"
 *                 indexes: 2
 *               - name: "metrics"
 *                 database: "timeseries-01"
 *                 type: "时序型"
 *                 fields: 8
 *                 rows: "45M"
 *                 size: "3.5 GB"
 *                 indexes: 2
 *               - name: "embeddings"
 *                 database: "vector-search"
 *                 type: "向量型"
 *                 fields: 5
 *                 rows: "1.5M"
 *                 size: "2.8 GB"
 *                 indexes: 1
 */
export const getTables = async (params?: QueryParams): Promise<ApiResponse<Table[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('tables') as Table[])
  }
  
  return api.get('/database/tables', { params })
}

/**
 * @openapi
 * /database/{databaseId}/tables/{tableName}:
 *   get:
 *     summary: 获取表详情
 *     tags:
 *       - Database
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: tableName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 表详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *             example:
 *               name: "users"
 *               database: "postgres-main"
 *               type: "关系型"
 *               fields: 12
 *               rows: "1.2M"
 *               size: "245 MB"
 *               indexes: 3
 */
export const getTableByName = async (databaseId: string, tableName: string): Promise<ApiResponse<Table | null>> => {
  if (useMock()) {
    const tables = getMockData('tables') as Table[]
    const table = tables.find(t => t.database === databaseId && t.name === tableName)
    
    if (!table) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(table)
  }
  
  return api.get(`/database/${databaseId}/tables/${tableName}`)
}

/**
 * @openapi
 * /database/{databaseId}/tables:
 *   post:
 *     summary: 创建表
 *     tags:
 *       - Database
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *             example:
 *               name: "users"
 *               database: "postgres-main"
 *               type: "关系型"
 *               fields: 12
 *               rows: "1.2M"
 *               size: "245 MB"
 *               indexes: 3
 */
export const createTable = async (databaseId: string, data: Omit<Table, 'database'>): Promise<ApiResponse<Table>> => {
  if (useMock()) {
    // 模拟创建表
    const newTable: Table = {
      database: databaseId,
      ...data
    }
    return mockResponse(newTable)
  }
  
  return api.post(`/database/${databaseId}/tables`, data)
}

/**
 * @openapi
 * /database/{databaseId}/tables/{tableName}:
 *   put:
 *     summary: 更新表
 *     tags:
 *       - Database
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: tableName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *             example:
 *               name: "users"
 *               database: "postgres-main"
 *               type: "关系型"
 *               fields: 12
 *               rows: "1.2M"
 *               size: "245 MB"
 *               indexes: 3
 */
export const updateTable = async (databaseId: string, tableName: string, data: Partial<Table>): Promise<ApiResponse<Table>> => {
  if (useMock()) {
    const tables = getMockData('tables') as Table[]
    const tableIndex = tables.findIndex(t => t.database === databaseId && t.name === tableName)
    
    if (tableIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedTable = { ...tables[tableIndex], ...data }
    tables[tableIndex] = updatedTable
    return mockResponse(updatedTable)
  }
  
  return api.put(`/database/${databaseId}/tables/${tableName}`, data)
}

/**
 * @openapi
 * /database/{databaseId}/tables/{tableName}:
 *   delete:
 *     summary: 删除表
 *     tags:
 *       - Database
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: tableName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 */
export const deleteTable = async (databaseId: string, tableName: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    const tables = getMockData('tables') as Table[]
    const tableIndex = tables.findIndex(t => t.database === databaseId && t.name === tableName)
    if (tableIndex !== -1) {
      tables.splice(tableIndex, 1)
    }
    return mockResponse(true)
  }
  
  return api.delete(`/database/${databaseId}/tables/${tableName}`)
}

/**
 * @openapi
 * /database/{databaseId}/query:
 *   post:
 *     summary: 执行 SQL 查询
 *     tags:
 *       - Database
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     columns:
 *                       type: array
 *                       items:
 *                         type: string
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                     executionTime:
 *                       type: string
 *                     rowCount:
 *                       type: integer
 *                   required: [columns, rows, executionTime, rowCount]
 *                 - type: object
 *                   properties:
 *                     affectedRows:
 *                       type: integer
 *                     executionTime:
 *                       type: string
 *                   required: [affectedRows, executionTime]
 *             examples:
 *               select:
 *                 summary: 查询类SQL
 *                 value:
 *                   columns: ["id", "username", "email", "created_at"]
 *                   rows:
 *                     - { id: 1, username: "admin", email: "admin@example.com", created_at: "2023-01-01 00:00:00" }
 *                     - { id: 2, username: "user1", email: "user1@example.com", created_at: "2023-01-02 10:30:00" }
 *                     - { id: 3, username: "user2", email: "user2@example.com", created_at: "2023-01-03 14:45:00" }
 *                     - { id: 4, username: "user3", email: "user3@example.com", created_at: "2023-01-04 09:15:00" }
 *                     - { id: 5, username: "user4", email: "user4@example.com", created_at: "2023-01-05 16:20:00" }
 *                   executionTime: "0.023 秒"
 *                   rowCount: 5
 *               update:
 *                 summary: 非查询类SQL
 *                 value:
 *                   affectedRows: 1
 *                   executionTime: "0.015 秒"
 */
export const executeQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟查询结果
    if (query.toLowerCase().includes('select')) {
      return mockResponse({
        columns: ["id", "username", "email", "created_at"],
        rows: [
          { id: 1, username: "admin", email: "admin@example.com", created_at: "2023-01-01 00:00:00" },
          { id: 2, username: "user1", email: "user1@example.com", created_at: "2023-01-02 10:30:00" },
          { id: 3, username: "user2", email: "user2@example.com", created_at: "2023-01-03 14:45:00" },
          { id: 4, username: "user3", email: "user3@example.com", created_at: "2023-01-04 09:15:00" },
          { id: 5, username: "user4", email: "user4@example.com", created_at: "2023-01-05 16:20:00" },
        ],
        executionTime: "0.023 秒",
        rowCount: 5,
      })
    } else {
      return mockResponse({
        affectedRows: 1,
        executionTime: "0.015 秒",
      })
    }
  }
  
  return api.post(`/database/${databaseId}/query`, { query })
}

// 导出子模块
export { relationalApi }