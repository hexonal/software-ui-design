import { api } from '@/lib/api/client'
import { ApiResponse, QueryParams } from '@/lib/api/types'
import { Database, Table } from '@/lib/types'

// =============================================== 数据库通用接口 ===============================================

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
 */
export const getDatabases = async (): Promise<ApiResponse<Database[]>> => {
  return api.get('/dfm/database')
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
 */
export const getDatabaseById = async (id: string): Promise<ApiResponse<Database | null>> => {
  return api.get(`/dfm/database/${id}`)
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
 */
export const createDatabase = async (data: Omit<Database, 'id'>): Promise<ApiResponse<Database>> => {
  return api.post('/dfm/database', data)
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
 */
export const updateDatabase = async (id: string, data: Partial<Database>): Promise<ApiResponse<Database | null>> => {
  return api.put(`/dfm/database/${id}`, data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export const deleteDatabase = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/database/${id}`)
}

// =============================================== 表管理接口 ===============================================

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
 */
export const getTables = async (): Promise<ApiResponse<Table[]>> => {
  return api.get('/dfm/database/tables')
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
 */
export const getTableById = async (databaseId: string, tableName: string): Promise<ApiResponse<Table | null>> => {
  return api.get(`/dfm/database/${databaseId}/tables/${tableName}`)
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
 */
export const createTable = async (databaseId: string, data: Omit<Table, 'database'>): Promise<ApiResponse<Table>> => {
  return api.post(`/dfm/database/${databaseId}/tables`, data)
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
 */
export const updateTable = async (databaseId: string, tableName: string, data: Partial<Table>): Promise<ApiResponse<Table | null>> => {
  return api.put(`/dfm/database/${databaseId}/tables/${tableName}`, data)
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
 */
export const deleteTable = async (databaseId: string, tableName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/database/${databaseId}/tables/${tableName}`)
}

// =============================================== 数据库查询接口 ===============================================

/**
 * @openapi
 * /database/{databaseId}/query:
 *   post:
 *     summary: 执行SQL查询
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
 *                 description: SQL查询语句
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export const executeQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/${databaseId}/query`, { query })
}

// =============================================== 特定数据库类型接口 ===============================================

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
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Database'
 */
export const getRelationalDatabases = async (): Promise<ApiResponse<Database[]>> => {
  return api.get('/dfm/database/relational')
}

/**
 * @openapi
 * /database/timeseries:
 *   get:
 *     summary: 获取时序数据库列表
 *     tags:
 *       - Database
 *     responses:
 *       200:
 *         description: 时序数据库列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Database'
 */
export const getTimeseriesDatabases = async (): Promise<ApiResponse<Database[]>> => {
  return api.get('/dfm/database/timeseries')
}

/**
 * @openapi
 * /database/vector:
 *   get:
 *     summary: 获取向量数据库列表
 *     tags:
 *       - Database
 *     responses:
 *       200:
 *         description: 向量数据库列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Database'
 */
export const getVectorDatabases = async (): Promise<ApiResponse<Database[]>> => {
  return api.get('/dfm/database/vector')
}

/**
 * @openapi
 * /database/geospatial:
 *   get:
 *     summary: 获取地理空间数据库列表
 *     tags:
 *       - Database
 *     responses:
 *       200:
 *         description: 地理空间数据库列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Database'
 */
export const getGeospatialDatabases = async (): Promise<ApiResponse<Database[]>> => {
  return api.get('/dfm/database/geospatial')
}

/**
 * @openapi
 * /database/timeseries/{id}/performance:
 *   get:
 *     summary: 获取时序数据库性能数据
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
 *         description: 时序数据库性能数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                 metrics:
 *                   type: object
 */
export const getTimeseriesPerformance = async (id: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/timeseries/${id}/performance`)
}