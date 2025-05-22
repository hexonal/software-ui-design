import { api } from '@/lib/api/client'
import { mockResponse, useMock } from '@/lib/api/mock-handler'
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
  if (useMock()) {
    // 模拟地理空间数据库列表
    const databases = [
      { id: "geo-analytics", name: "地理分析库", tables: 12, size: "320 GB", status: "正常" },
      { id: "geo-locations", name: "位置数据库", tables: 8, size: "180 GB", status: "正常" },
      { id: "geo-boundaries", name: "边界数据库", tables: 5, size: "420 GB", status: "警告" },
    ]
    
    return mockResponse(databases)
  }
  
  return api.get('/database/geospatial', { params })
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
  if (useMock()) {
    const databases = [
      { id: "geo-analytics", name: "地理分析库", tables: 12, size: "320 GB", status: "正常", description: "用于地理数据分析的数据库" },
      { id: "geo-locations", name: "位置数据库", tables: 8, size: "180 GB", status: "正常", description: "存储位置信息的数据库" },
      { id: "geo-boundaries", name: "边界数据库", tables: 5, size: "420 GB", status: "警告", description: "存储地理边界数据的数据库" },
    ]
    
    const database = databases.find(db => db.id === id)
    
    if (!database) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(database)
  }
  
  return api.get(`/database/geospatial/${id}`)
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
  if (useMock()) {
    // 模拟创建地理空间数据库
    const newDatabase = {
      id: `geo-${Date.now()}`,
      ...data,
      tables: 0,
      size: "0 GB",
      status: "正常"
    }
    return mockResponse(newDatabase)
  }
  
  return api.post('/database/geospatial', data)
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
 *                 records: 1245
 *                 indexType: "GIST"
 *               - name: "roads"
 *                 geometryType: "LINESTRING"
 *                 srid: "EPSG:4326"
 *                 records: 3782
 *                 indexType: "GIST"
 */
export const getGeospatialTables = async (databaseId: string, params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟空间表列表
    const tables = [
      { name: "cities", geometryType: "POINT", srid: "EPSG:4326", records: 1245, indexType: "GIST" },
      { name: "roads", geometryType: "LINESTRING", srid: "EPSG:4326", records: 3782, indexType: "GIST" },
      { name: "districts", geometryType: "POLYGON", srid: "EPSG:4326", records: 142, indexType: "GIST" },
      { name: "poi", geometryType: "POINT", srid: "EPSG:4326", records: 8954, indexType: "GIST" },
      { name: "rivers", geometryType: "LINESTRING", srid: "EPSG:4326", records: 567, indexType: "GIST" },
    ]
    
    return mockResponse(tables)
  }
  
  return api.get(`/database/geospatial/${databaseId}/tables`, { params })
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
 *               srid:
 *                 type: string
 *           example:
 *             name: "new_spatial_table"
 *             geometryType: "POINT"
 *             srid: "EPSG:4326"
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             example:
 *               name: "new_spatial_table"
 *               geometryType: "POINT"
 *               srid: "EPSG:4326"
 *               records: 0
 *               indexType: "GIST"
 */
export const createGeospatialTable = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟创建空间表
    return mockResponse({
      name: data.name,
      geometryType: data.geometryType,
      srid: data.srid,
      records: 0,
      indexType: "GIST"
    })
  }
  
  return api.post(`/database/geospatial/${databaseId}/tables`, data)
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
 *             query: "SELECT name, ST_AsText(geom) FROM cities WHERE ST_DWithin(geom, ST_GeomFromText('POINT(116 40)', 4326), 0.1);"
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             example:
 *               columns: ["name", "type", "coordinates"]
 *               rows:
 *                 - name: "北京市"
 *                   type: "POINT"
 *                   coordinates: "116.4074, 39.9042"
 *                 - name: "昌平区"
 *                   type: "POINT"
 *                   coordinates: "116.2312, 40.2207"
 *               executionTime: "0.042 秒"
 *               rowCount: 2
 */
export const executeGeospatialQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟查询结果
    if (query.toLowerCase().includes('select')) {
      return mockResponse({
        columns: ["name", "type", "coordinates"],
        rows: [
          { name: "北京市", type: "POINT", coordinates: "116.4074, 39.9042" },
          { name: "昌平区", type: "POINT", coordinates: "116.2312, 40.2207" },
          { name: "海淀区", type: "POINT", coordinates: "116.2980, 39.9592" },
          { name: "朝阳区", type: "POINT", coordinates: "116.4845, 39.9484" },
          { name: "丰台区", type: "POINT", coordinates: "116.2871, 39.8585" },
        ],
        executionTime: "0.042 秒",
        rowCount: 5,
      })
    } else {
      return mockResponse({
        affectedRows: 1,
        executionTime: "0.015 秒",
      })
    }
  }
  
  return api.post(`/database/geospatial/${databaseId}/query`, { query })
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
 *         description: 地图可视化数据
 *         content:
 *           application/json:
 *             example:
 *               type: "FeatureCollection"
 *               features:
 *                 - type: "Feature"
 *                   properties: { name: "北京市", population: 21893095 }
 *                   geometry: { type: "Point", coordinates: [116.4074, 39.9042] }
 *                 - type: "Feature"
 *                   properties: { name: "上海市", population: 24870895 }
 *                   geometry: { type: "Point", coordinates: [121.4737, 31.2304] }
 */
export const getMapVisualizationData = async (databaseId: string, tableName: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟地图可视化数据
    return mockResponse({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "北京市", population: 21893095 },
          geometry: { type: "Point", coordinates: [116.4074, 39.9042] }
        },
        {
          type: "Feature",
          properties: { name: "上海市", population: 24870895 },
          geometry: { type: "Point", coordinates: [121.4737, 31.2304] }
        },
        {
          type: "Feature",
          properties: { name: "广州市", population: 15305190 },
          geometry: { type: "Point", coordinates: [113.2644, 23.1291] }
        },
        {
          type: "Feature",
          properties: { name: "深圳市", population: 12591696 },
          geometry: { type: "Point", coordinates: [114.0579, 22.5431] }
        }
      ]
    })
  }
  
  return api.get(`/database/geospatial/${databaseId}/visualization/${tableName}`)
}