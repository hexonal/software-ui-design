import { api } from '@/lib/api/client'
import { mockResponse, useMock } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

/**
 * @openapi
 * /database/relational:
 *   get:
 *     summary: 获取关系型数据库列表
 *     tags:
 *       - Database
 *     responses:
 *       200:
 *         description: 关系型数据库列表
 *         content:
 *           application/json:
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
 */

// 获取关系型数据库列表
export const getRelationalDatabases = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟关系型数据库列表
    const databases = [
      { id: "postgres-main", name: "主数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "1.2 TB", tables: 42 },
      { id: "postgres-replica", name: "副本数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "1.1 TB", tables: 42 },
      { id: "postgres-dev", name: "开发数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "800 GB", tables: 38 },
      { id: "postgres-test", name: "测试数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "750 GB", tables: 35 },
      { id: "postgres-analytics", name: "分析数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "2.1 TB", tables: 28 },
    ]
    
    return mockResponse(databases)
  }
  
  return api.get('/database/relational', { params })
}

// 获取关系型数据库详情
/**
 * @openapi
 * /database/relational/{id}:
 *   get:
 *     summary: 获取关系型数据库详情
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
 *         description: 关系型数据库详情
 *         content:
 *           application/json:
 *             example:
 *               id: "postgres-main"
 *               name: "主数据库"
 *               charset: "UTF-8"
 *               collation: "en_US.UTF-8"
 *               size: "1.2 TB"
 *               tables: 42
 */
export const getRelationalDatabaseById = async (id: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    const databases = [
      { id: "postgres-main", name: "主数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "1.2 TB", tables: 42 },
      { id: "postgres-replica", name: "副本数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "1.1 TB", tables: 42 },
      { id: "postgres-dev", name: "开发数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "800 GB", tables: 38 },
      { id: "postgres-test", name: "测试数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "750 GB", tables: 35 },
      { id: "postgres-analytics", name: "分析数据库", charset: "UTF-8", collation: "en_US.UTF-8", size: "2.1 TB", tables: 28 },
    ]
    
    const database = databases.find(db => db.id === id)
    
    if (!database) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(database)
  }
  
  return api.get(`/database/relational/${id}`)
}

// 执行 SQL 查询
/**
 * @openapi
 * /database/relational/{databaseId}/query:
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
 *           example:
 *             query: "SELECT * FROM users LIMIT 5;"
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             example:
 *               columns: ["id", "username", "email", "created_at"]
 *               rows:
 *                 - id: 1
 *                   username: "admin"
 *                   email: "admin@example.com"
 *                   created_at: "2023-01-01 00:00:00"
 *                 - id: 2
 *                   username: "user1"
 *                   email: "user1@example.com"
 *                   created_at: "2023-01-02 10:30:00"
 *               executionTime: "0.023 秒"
 *               rowCount: 2
 */
export const executeSQLQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
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
  
  return api.post(`/database/relational/${databaseId}/query`, { query })
}