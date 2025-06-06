import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

/**
 * @openapi
 * /data-model/tables/{databaseId}/{tableName}/structure:
 *   get:
 *     summary: 获取表结构
 *     tags:
 *       - DataModel
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
 *         description: 表结构
 *         content:
 *           application/json:
 *             example:
 *               - name: "id"
 *                 type: "integer"
 *                 length: null
 *                 nullable: false
 *                 default: "自增"
 *               - name: "username"
 *                 type: "varchar"
 *                 length: 50
 *                 nullable: false
 *                 default: null
 *               - name: "email"
 *                 type: "varchar"
 *                 length: 100
 *                 nullable: false
 *                 default: null
 *               - name: "password_hash"
 *                 type: "varchar"
 *                 length: 255
 *                 nullable: false
 *                 default: null
 *               - name: "created_at"
 *                 type: "timestamp"
 *                 length: null
 *                 nullable: false
 *                 default: "CURRENT_TIMESTAMP"
 */
export const getTableStructure = async (databaseId: string, tableName: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/data-model/tables/${databaseId}/${tableName}/structure`)
}

/**
 * @openapi
 * /data-model/tables/{databaseId}:
 *   post:
 *     summary: 创建表
 *     tags:
 *       - DataModel
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
 *               name:
 *                 type: string
 *                 description: 表名
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     length:
 *                       type: integer
 *                     nullable:
 *                       type: boolean
 *                     default:
 *                       type: string
 *           example:
 *             name: "new_table"
 *             fields:
 *               - name: "id"
 *                 type: "integer"
 *                 nullable: false
 *               - name: "column1"
 *                 type: "varchar"
 *                 length: 255
 *                 nullable: true
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               tableName: "new_table"
 */
export const createTable = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/tables/${databaseId}`, data)
}

/**
 * @openapi
 * /data-model/tables/{databaseId}/{tableName}:
 *   put:
 *     summary: 修改表结构
 *     tags:
 *       - DataModel
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
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [ADD_COLUMN, MODIFY_COLUMN, DROP_COLUMN, RENAME_COLUMN]
 *               column:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   length:
 *                     type: integer
 *                   nullable:
 *                     type: boolean
 *                   default:
 *                     type: string
 *                   newName:
 *                     type: string
 *           example:
 *             action: "ADD_COLUMN"
 *             column:
 *               name: "new_column"
 *               type: "varchar"
 *               length: 255
 *               nullable: true
 *     responses:
 *       200:
 *         description: 修改成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *   delete:
 *     summary: 删除表
 *     tags:
 *       - DataModel
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
 *             example:
 *               success: true
 */
export const alterTable = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  return api.put(`/dfm/data-model/tables/${databaseId}/${tableName}`, data)
}

export const dropTable = async (databaseId: string, tableName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/data-model/tables/${databaseId}/${tableName}`)
}

/**
 * @openapi
 * /data-model/tables/{databaseId}/{tableName}/indexes:
 *   get:
 *     summary: 获取表索引
 *     tags:
 *       - DataModel
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
 *         description: 索引列表
 *         content:
 *           application/json:
 *             example:
 *               - name: "pk_users_id"
 *                 columns: ["id"]
 *                 type: "PRIMARY"
 *                 method: "BTREE"
 *               - name: "idx_users_email"
 *                 columns: ["email"]
 *                 type: "UNIQUE"
 *                 method: "BTREE"
 *   post:
 *     summary: 创建索引
 *     tags:
 *       - DataModel
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 索引名称
 *               columns:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 索引字段
 *               type:
 *                 type: string
 *                 enum: [UNIQUE, INDEX, PRIMARY]
 *                 description: 索引类型
 *               method:
 *                 type: string
 *                 enum: [BTREE, HASH]
 *                 description: 索引方法
 *           example:
 *             name: "idx_username"
 *             columns: ["username"]
 *             type: "UNIQUE"
 *             method: "BTREE"
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               indexName: "idx_username"
 */
export const getTableIndexes = async (databaseId: string, tableName: string): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes`)
}

export const createIndex = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes`, data)
}

/**
 * @openapi
 * /data-model/tables/{databaseId}/{tableName}/indexes/{indexName}:
 *   delete:
 *     summary: 删除索引
 *     tags:
 *       - DataModel
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
 *       - name: indexName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 */
export const dropIndex = async (databaseId: string, tableName: string, indexName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes/${indexName}`)
}

/**
 * @openapi
 * /data-model/import/{databaseId}/{tableName}:
 *   post:
 *     summary: 导入数据
 *     tags:
 *       - DataModel
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 导入文件
 *               name:
 *                 type: string
 *                 description: 任务名称
 *               format:
 *                 type: string
 *                 enum: [CSV, JSON, SQL]
 *                 description: 文件格式
 *     responses:
 *       200:
 *         description: 导入任务创建成功
 *         content:
 *           application/json:
 *             example:
 *               id: "import-123456789"
 *               name: "数据导入"
 *               source: "data.csv"
 *               target: "users"
 *               database: "test_db"
 *               status: "进行中"
 *               progress: 0
 *               rows: 0
 *               created: "2024-01-15 10:30:00"
 */
export const importData = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/import/${databaseId}/${tableName}`, data)
}

/**
 * @openapi
 * /data-model/export/{databaseId}:
 *   post:
 *     summary: 导出数据
 *     tags:
 *       - DataModel
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
 *               source:
 *                 type: string
 *                 description: 源表名
 *               filename:
 *                 type: string
 *                 description: 导出文件名
 *               format:
 *                 type: string
 *                 enum: [CSV, JSON, SQL]
 *                 description: 导出格式
 *               name:
 *                 type: string
 *                 description: 任务名称
 *           example:
 *             source: "users"
 *             filename: "users_export.csv"
 *             format: "CSV"
 *             name: "用户数据导出"
 *     responses:
 *       200:
 *         description: 导出任务创建成功
 *         content:
 *           application/json:
 *             example:
 *               id: "export-123456789"
 *               name: "数据导出"
 *               source: "users"
 *               target: "users_export.csv"
 *               database: "test_db"
 *               status: "进行中"
 *               progress: 0
 *               rows: 0
 *               created: "2024-01-15 10:35:00"
 */
export const exportData = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/export/${databaseId}`, data)
}

/**
 * @openapi
 * /data-model/tasks:
 *   get:
 *     summary: 获取导入/导出任务状态
 *     tags:
 *       - DataModel
 *     responses:
 *       200:
 *         description: 任务列表
 *         content:
 *           application/json:
 *             example:
 *               - id: "import-001"
 *                 name: "用户数据导入"
 *                 source: "users.csv"
 *                 target: "users"
 *                 database: "test_db"
 *                 status: "已完成"
 *                 progress: 100
 *                 rows: 1500
 *                 created: "2024-01-15 09:30:00"
 *                 completed: "2024-01-15 09:35:00"
 *               - id: "export-001"
 *                 name: "产品数据导出"
 *                 source: "products"
 *                 target: "products_export.json"
 *                 database: "test_db"
 *                 status: "进行中"
 *                 progress: 75
 *                 rows: 850
 *                 created: "2024-01-15 10:00:00"
 */
export const getImportExportTasks = async (): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/data-model/tasks')
}

// 删除导入/导出任务
export const deleteTask = async (taskId: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/data-model/tasks/${taskId}`)
}

// 取消导入/导出任务
export const cancelTask = async (taskId: string): Promise<ApiResponse<boolean>> => {
  return api.post(`/dfm/data-model/tasks/${taskId}/cancel`)
}

// 重新启动失败的导入/导出任务
export const retryTask = async (taskId: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/data-model/tasks/${taskId}/retry`)
}