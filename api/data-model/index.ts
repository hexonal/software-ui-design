import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
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
  if (useMock()) {
    // 根据表名返回不同的结构
    let structure: any[] = []
    
    if (tableName === 'users') {
      structure = [
        { name: "id", type: "integer", length: null, nullable: false, default: "自增" },
        { name: "username", type: "varchar", length: 50, nullable: false, default: null },
        { name: "email", type: "varchar", length: 100, nullable: false, default: null },
        { name: "password_hash", type: "varchar", length: 255, nullable: false, default: null },
        { name: "created_at", type: "timestamp", length: null, nullable: false, default: "CURRENT_TIMESTAMP" }
      ]
    } else if (tableName === 'products') {
      structure = [
        { name: "id", type: "integer", length: null, nullable: false, default: "自增" },
        { name: "name", type: "varchar", length: 100, nullable: false, default: null },
        { name: "description", type: "text", length: null, nullable: true, default: null },
        { name: "price", type: "decimal", length: "10,2", nullable: false, default: "0.00" },
        { name: "category_id", type: "integer", length: null, nullable: false, default: null }
      ]
    } else if (tableName === 'orders') {
      structure = [
        { name: "id", type: "integer", length: null, nullable: false, default: "自增" },
        { name: "user_id", type: "integer", length: null, nullable: false, default: null },
        { name: "status", type: "varchar", length: 20, nullable: false, default: "'pending'" },
        { name: "total_amount", type: "decimal", length: "10,2", nullable: false, default: "0.00" },
        { name: "created_at", type: "timestamp", length: null, nullable: false, default: "CURRENT_TIMESTAMP" }
      ]
    }
    
    return mockResponse(structure)
  }
  
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
  if (useMock()) {
    return mockResponse({ success: true, tableName: data.name })
  }
  
  return api.post(`/data-model/tables/${databaseId}`, data)
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
 *               type: "text"
 *               nullable: true
 *     responses:
 *       200:
 *         description: 修改成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 */
export const alterTable = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({ success: true })
  }
  
  return api.put(`/data-model/tables/${databaseId}/${tableName}`, data)
}

/**
 * @openapi
 * /data-model/tables/{databaseId}/{tableName}:
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
export const dropTable = async (databaseId: string, tableName: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/data-model/tables/${databaseId}/${tableName}`)
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
 *               - name: "idx_users_email"
 *                 columns: ["email"]
 *                 type: "UNIQUE"
 *                 method: "BTREE"
 *               - name: "idx_users_username"
 *                 columns: ["username"]
 *                 type: "UNIQUE"
 *                 method: "BTREE"
 *               - name: "idx_users_created_at"
 *                 columns: ["created_at"]
 *                 type: "INDEX"
 *                 method: "BTREE"
 */
export const getTableIndexes = async (databaseId: string, tableName: string): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟索引数据
    const indexes = [
      { name: "idx_users_email", columns: ["email"], type: "UNIQUE", method: "BTREE" },
      { name: "idx_users_username", columns: ["username"], type: "UNIQUE", method: "BTREE" },
      { name: "idx_users_created_at", columns: ["created_at"], type: "INDEX", method: "BTREE" }
    ]
    
    return mockResponse(indexes)
  }
  
  return api.get(`/dfm/data-model/tables/${databaseId}/${tableName}/indexes`)
}

/**
 * @openapi
 * /data-model/tables/{databaseId}/{tableName}/indexes:
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
 *               columns:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *                 enum: [PRIMARY, UNIQUE, INDEX, FULLTEXT]
 *               method:
 *                 type: string
 *                 enum: [BTREE, HASH, RTREE, GIN, GIST]
 *           example:
 *             name: "idx_new_column"
 *             columns: ["new_column"]
 *             type: "INDEX"
 *             method: "BTREE"
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               indexName: "idx_new_column"
 */
export const createIndex = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({ success: true, indexName: data.name })
  }
  
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
  if (useMock()) {
    return mockResponse(true)
  }
  
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 任务名称
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 导入文件
 *           example:
 *             name: "用户数据导入"
 *             file: "users.csv"
 *     responses:
 *       200:
 *         description: 导入任务
 *         content:
 *           application/json:
 *             example:
 *               id: "import-1678886400000"
 *               name: "用户数据导入"
 *               source: "users.csv"
 *               target: "users"
 *               database: "postgres-main"
 *               status: "进行中"
 *               progress: 0
 *               rows: 0
 *               created: "2023-03-15 12:00:00"
 */
export const importData = async (databaseId: string, tableName: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟导入任务
    return mockResponse({
      id: `import-${Date.now()}`,
      name: data.name || "数据导入",
      source: data.file?.name || "导入文件",
      target: tableName,
      database: databaseId,
      status: "进行中",
      progress: 0,
      rows: 0,
      created: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  
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
 *               name:
 *                 type: string
 *                 description: 任务名称
 *               source:
 *                 type: string
 *                 description: 导出源（表名/查询语句）
 *               filename:
 *                 type: string
 *                 description: 导出文件名
 *           example:
 *             name: "用户数据导出"
 *             source: "users"
 *             filename: "users_export.csv"
 *     responses:
 *       200:
 *         description: 导出任务
 *         content:
 *           application/json:
 *             example:
 *               id: "export-1678886400000"
 *               name: "用户数据导出"
 *               source: "users"
 *               target: "users_export.csv"
 *               database: "postgres-main"
 *               status: "进行中"
 *               progress: 0
 *               rows: 0
 *               created: "2023-03-15 12:00:00"
 */
export const exportData = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟导出任务
    return mockResponse({
      id: `export-${Date.now()}`,
      name: data.name || "数据导出",
      source: data.source || "users",
      target: data.filename || "export.csv",
      database: databaseId,
      status: "进行中",
      progress: 0,
      rows: 0,
      created: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  
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
 *                 database: "postgres-main"
 *                 status: "完成"
 *                 progress: 100
 *                 rows: 15420
 *                 created: "2023-05-09 14:30:22"
 *               - id: "export-001"
 *                 name: "用户数据导出"
 *                 source: "users"
 *                 target: "users_backup.csv"
 *                 database: "postgres-main"
 *                 status: "完成"
 *                 progress: 100
 *                 rows: 15420
 *                 created: "2023-05-07 11:20:15"
 */
export const getImportExportTasks = async (): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟导入导出任务列表
    const importTasks = [
      {
        id: "import-001",
        name: "用户数据导入",
        source: "users.csv",
        target: "users",
        database: "postgres-main",
        status: "完成",
        progress: 100,
        rows: 15420,
        created: "2023-05-09 14:30:22",
      },
      {
        id: "import-002",
        name: "产品数据导入",
        source: "products.csv",
        target: "products",
        database: "postgres-main",
        status: "进行中",
        progress: 65,
        rows: 8500,
        created: "2023-05-10 09:15:45",
      },
      {
        id: "import-003",
        name: "订单历史导入",
        source: "orders_history.csv",
        target: "orders",
        database: "postgres-main",
        status: "失败",
        progress: 32,
        rows: 25000,
        created: "2023-05-08 16:42:10",
      },
    ]

    const exportTasks = [
      {
        id: "export-001",
        name: "用户数据导出",
        source: "users",
        target: "users_backup.csv",
        database: "postgres-main",
        status: "完成",
        progress: 100,
        rows: 15420,
        created: "2023-05-07 11:20:15",
      },
      {
        id: "export-002",
        name: "月度报表导出",
        source: "monthly_report",
        target: "report_2023_04.xlsx",
        database: "postgres-analytics",
        status: "完成",
        progress: 100,
        rows: 1250,
        created: "2023-05-01 08:30:00",
      },
    ]
    
    return mockResponse([...importTasks, ...exportTasks] as any[])
  }
  
  return api.get('/dfm/data-model/tasks')
}