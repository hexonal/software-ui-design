import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

/**
 * @openapi
 * /database/geospatial:
 *   get:
 *     summary: 获取地理空间数据库列表
 *     tags:
 *       - Geospatial
 *     responses:
 *       200:
 *         description: 地理空间数据库列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   tables:
 *                     type: integer
 *                   size:
 *                     type: string
 *                   status:
 *                     type: string
 *             example:
 *               - id: "geo-analytics"
 *                 name: "地理分析库"
 *                 tables: 12
 *                 size: "320 GB"
 *                 status: "正常"
 *               - id: "geo-locations"
 *                 name: "位置数据库"
 *                 tables: 8
 *                 size: "180 GB"
 *                 status: "正常"
 *               - id: "geo-boundaries"
 *                 name: "边界数据库"
 *                 tables: 5
 *                 size: "420 GB"
 *                 status: "警告"
 */
export const getGeospatialDatabases = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/database/geospatial', { params })
}

/**
 * @openapi
 * /database/geospatial/{id}:
 *   get:
 *     summary: 获取地理空间数据库详情
 *     tags:
 *       - Geospatial
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 地理空间数据库详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 tables:
 *                   type: integer
 *                 size:
 *                   type: string
 *                 status:
 *                   type: string
 *                 description:
 *                   type: string
 *             example:
 *               id: "geo-analytics"
 *               name: "地理分析库"
 *               tables: 12
 *               size: "320 GB"
 *               status: "正常"
 *               description: "用于地理数据分析的数据库"
 */
export const getGeospatialDatabaseById = async (id: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/geospatial/${id}`)
}

/**
 * @openapi
 * /database/geospatial:
 *   post:
 *     summary: 创建地理空间数据库
 *     tags:
 *       - Geospatial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 tables:
 *                   type: integer
 *                 size:
 *                   type: string
 *                 status:
 *                   type: string
 *             example:
 *               id: "geo-analytics"
 *               name: "地理分析库"
 *               tables: 0
 *               size: "0 GB"
 *               status: "正常"
 */
export const createGeospatialDatabase = async (data: any): Promise<ApiResponse<any>> => {
  return api.post('/dfm/database/geospatial', data)
}

/**
 * @openapi
 * /database/geospatial/{databaseId}/tables:
 *   get:
 *     summary: 获取空间表列表
 *     tags:
 *       - Geospatial
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 空间表列表
 *         content:
 *           application/json:
 *             example:
 *               - name: "cities"
 *                 geometryType: "POINT"
 *                 srid: "EPSG:4326"
 *                 description: "城市位置数据"
 *                 records: 2500
 */
export const getGeospatialTables = async (databaseId: string, params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/database/geospatial/${databaseId}/tables`, { params })
}

/**
 * @openapi
 * /database/geospatial/{databaseId}/tables:
 *   post:
 *     summary: 创建空间表
 *     tags:
 *       - Geospatial
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
 *               geometryType:
 *                 type: string
 *                 enum: ["POINT", "LINESTRING", "POLYGON", "MULTIPOINT", "MULTILINESTRING", "MULTIPOLYGON"]
 *               srid:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "new_places"
 *             geometryType: "POINT"
 *             srid: "EPSG:4326"
 *             description: "新建地点表"
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createGeospatialTable = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/geospatial/${databaseId}/tables`, data)
}

/**
 * @openapi
 * /database/geospatial/{databaseId}/query:
 *   post:
 *     summary: 执行空间查询
 *     tags:
 *       - Geospatial
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
 *             query: "SELECT name, ST_AsText(geometry) FROM cities WHERE ST_DWithin(geometry, ST_Point(116.407395, 39.904211), 1000);"
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "北京"
 *                 geometry: "POINT(116.407395 39.904211)"
 *                 type: "首都"
 */
export const executeGeospatialQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/geospatial/${databaseId}/query`, { query })
}

/**
 * @openapi
 * /database/geospatial/{databaseId}/visualization/{tableName}:
 *   get:
 *     summary: 获取地图可视化数据
 *     tags:
 *       - Geospatial
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
 *         description: GeoJSON格式的可视化数据
 *         content:
 *           application/json:
 *             example:
 *               type: "FeatureCollection"
 *               features:
 *                 - type: "Feature"
 *                   geometry:
 *                     type: "Point"
 *                     coordinates: [116.407395, 39.904211]
 *                   properties:
 *                     name: "北京"
 *                     type: "首都"
 */
export const getMapVisualizationData = async (databaseId: string, tableName: string): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/geospatial/${databaseId}/visualization/${tableName}`)
}