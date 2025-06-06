import { api } from '@/lib/api/client'
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
  return api.get('/dfm/database/relational', { params })
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
  return api.get(`/dfm/database/relational/${id}`)
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
  return api.post(`/dfm/database/relational/${databaseId}/query`, { query })
}