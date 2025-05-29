import { api } from '@/lib/api/client'
import { mockResponse, useMock } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

/**
 * @openapi
 * /database/timeseries:
 *   get:
 *     summary: 获取时序数据库列表
 *     tags:
 *       - Timeseries
 *     responses:
 *       200:
 *         description: 时序数据库列表
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
 *                   retention:
 *                     type: string
 *                   series:
 *                     type: integer
 *                   points:
 *                     type: string
 *                   status:
 *                     type: string
 *             example:
 *               - id: "timeseries-01"
 *                 name: "监控数据库"
 *                 retention: "30天"
 *                 series: 156
 *                 points: "1.2B"
 *                 status: "正常"
 *               - id: "timeseries-02"
 *                 name: "日志数据库"
 *                 retention: "90天"
 *                 series: 78
 *                 points: "3.5B"
 *                 status: "警告"
 */
export const getTimeseriesDatabases = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟时序数据库列表
    const databases = [
      { id: "timeseries-01", name: "监控数据库", retention: "30天", series: 156, points: "1.2B", status: "正常" },
      { id: "timeseries-02", name: "日志数据库", retention: "90天", series: 78, points: "3.5B", status: "警告" },
      { id: "timeseries-03", name: "传感器数据库", retention: "365天", series: 245, points: "5.7B", status: "正常" },
      { id: "timeseries-04", name: "指标数据库", retention: "180天", series: 124, points: "2.3B", status: "正常" },
    ]
    
    return mockResponse(databases)
  }
  
  return api.get('/dfm/database/timeseries', { params })
}

/**
 * @openapi
 * /database/timeseries/{id}:
 *   get:
 *     summary: 获取时序数据库详情
 *     tags:
 *       - Timeseries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 时序数据库详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 retention:
 *                   type: string
 *                 series:
 *                   type: integer
 *                 points:
 *                   type: string
 *                 status:
 *                   type: string
 *                 description:
 *                   type: string
 *             example:
 *               id: "timeseries-01"
 *               name: "监控数据库"
 *               retention: "30天"
 *               series: 156
 *               points: "1.2B"
 *               status: "正常"
 *               description: "存储系统监控数据"
 */
export const getTimeseriesDatabaseById = async (id: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    const databases = [
      { id: "timeseries-01", name: "监控数据库", retention: "30天", series: 156, points: "1.2B", status: "正常", description: "存储系统监控数据" },
      { id: "timeseries-02", name: "日志数据库", retention: "90天", series: 78, points: "3.5B", status: "警告", description: "存储系统日志数据" },
      { id: "timeseries-03", name: "传感器数据库", retention: "365天", series: 245, points: "5.7B", status: "正常", description: "存储IoT传感器数据" },
      { id: "timeseries-04", name: "指标数据库", retention: "180天", series: 124, points: "2.3B", status: "正常", description: "存储业务指标数据" },
    ]
    
    const database = databases.find(db => db.id === id)
    
    if (!database) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(database)
  }
  
  return api.get(`/database/timeseries/${id}`)
}

/**
 * @openapi
 * /database/timeseries:
 *   post:
 *     summary: 创建时序数据库
 *     tags:
 *       - Timeseries
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
 *                 series:
 *                   type: integer
 *                 points:
 *                   type: string
 *                 status:
 *                   type: string
 *             example:
 *               id: "timeseries-01"
 *               name: "监控数据库"
 *               series: 0
 *               points: "0"
 *               status: "正常"
 */
export const createTimeseriesDatabase = async (data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟创建时序数据库
    const newDatabase = {
      id: `timeseries-${Date.now()}`,
      ...data,
      series: 0,
      points: "0",
      status: "正常"
    }
    return mockResponse(newDatabase)
  }
  
  return api.post('/database/timeseries', data)
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/series:
 *   get:
 *     summary: 获取时间序列列表
 *     tags:
 *       - Timeseries
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 时间序列列表
 *         content:
 *           application/json:
 *             example:
 *               - name: "cpu_usage"
 *                 tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }]
 *                 type: "float"
 *                 points: "2.5M"
 *               - name: "memory_usage"
 *                 tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }]
 *                 type: "float"
 *                 points: "2.5M"
 */
export const getTimeseries = async (databaseId: string, params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟时间序列列表
    const series = [
      { name: "cpu_usage", tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }], type: "float", points: "2.5M" },
      { name: "memory_usage", tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }], type: "float", points: "2.5M" },
      { name: "disk_usage", tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }], type: "float", points: "2.5M" },
      { name: "network_in", tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }], type: "float", points: "2.5M" },
      { name: "network_out", tags: [{ key: "host", value: "server01" }, { key: "region", value: "cn-east" }], type: "float", points: "2.5M" },
    ]
    
    return mockResponse(series)
  }
  
  return api.get(`/database/timeseries/${databaseId}/series`, { params })
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/series:
 *   post:
 *     summary: 创建时间序列
 *     tags:
 *       - Timeseries
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
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                       value:
 *                         type: string
 *                 type:
 *                   type: string
 *                 points:
 *                   type: string
 *             example:
 *               name: "cpu_usage"
 *               tags:
 *                 - key: "host"
 *                   value: "server01"
 *                 - key: "region"
 *                   value: "cn-east"
 *               type: "float"
 *               points: "0"
 */
export const createTimeseries = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟创建时间序列
    const newSeries = {
      name: data.name,
      tags: data.tags || [],
      type: data.type || 'float',
      points: "0"
    }
    return mockResponse(newSeries)
  }
  return api.post(`/database/timeseries/${databaseId}/series`, data)
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/series/{seriesName}:
 *   delete:
 *     summary: 删除时间序列
 *     tags:
 *       - Timeseries
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: seriesName
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
export const deleteTimeseries = async (databaseId: string, seriesName: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  return api.delete(`/database/timeseries/${databaseId}/series/${seriesName}`)
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/query:
 *   post:
 *     summary: 执行时序查询
 *     tags:
 *       - Timeseries
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
 *             query: "SELECT mean(value) FROM cpu_usage WHERE host = 'server01' GROUP BY time(1h)"
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - time: "00:00"
 *                   value: 42
 *                 - time: "01:00"
 *                   value: 38
 *               executionTime: "0.034 秒"
 *               pointCount: 2
 */
export const executeTimeseriesQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟查询结果
    const sampleData = [
      { time: "00:00", value: 42 },
      { time: "01:00", value: 38 },
      { time: "02:00", value: 35 },
      { time: "03:00", value: 32 },
      { time: "04:00", value: 30 },
      { time: "05:00", value: 34 },
      { time: "06:00", value: 45 },
      { time: "07:00", value: 58 },
      { time: "08:00", value: 72 },
      { time: "09:00", value: 78 },
      { time: "10:00", value: 82 },
      { time: "11:00", value: 85 },
      { time: "12:00", value: 86 },
    ]
    
    return mockResponse({
      data: sampleData,
      executionTime: "0.034 秒",
      pointCount: sampleData.length,
    })
  }
  
  return api.post(`/database/timeseries/${databaseId}/query`, { query })
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/retention-policies:
 *   post:
 *     summary: 创建保留策略
 *     tags:
 *       - Timeseries
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
 *               duration:
 *                 type: string
 *               replication:
 *                 type: integer
 *               default:
 *                 type: boolean
 *           example:
 *             name: "custom_policy"
 *             duration: "7d"
 *             replication: 1
 *             default: false
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             example:
 *               name: "custom_policy"
 *               duration: "7d"
 *               replication: 1
 *               default: false
 */
export const createRetentionPolicy = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({
      name: data.name,
      duration: data.duration,
      replication: data.replication || 1,
      default: data.default || false
    })
  }
  
  return api.post(`/database/timeseries/${databaseId}/retention-policies`, data)
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/retention-policies:
 *   get:
 *     summary: 获取保留策略列表
 *     tags:
 *       - Timeseries
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 保留策略列表
 *         content:
 *           application/json:
 *             example:
 *               - name: "autogen"
 *                 duration: "30d"
 *                 replication: 1
 *                 default: true
 *               - name: "monthly"
 *                 duration: "90d"
 *                 replication: 1
 *                 default: false
 */
export const getRetentionPolicies = async (databaseId: string): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟保留策略列表
    const policies = [
      { name: "autogen", duration: "30d", replication: 1, default: true },
      { name: "monthly", duration: "90d", replication: 1, default: false },
      { name: "yearly", duration: "365d", replication: 1, default: false },
    ]
    
    return mockResponse(policies)
  }
  
  return api.get(`/database/timeseries/${databaseId}/retention-policies`)
}

/**
 * @openapi
 * /database/timeseries/{databaseId}/metrics:
 *   get:
 *     summary: 获取时序数据库性能指标
 *     tags:
 *       - Timeseries
 *     parameters:
 *       - name: databaseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: timeRange
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 性能指标
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 writePerformance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       value:
 *                         type: integer
 *                 readPerformance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       value:
 *                         type: integer
 *                 queryLatency:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       value:
 *                         type: integer
 *                 memoryUsage:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       value:
 *                         type: integer
 *             example:
 *               writePerformance:
 *                 - time: "00:00"
 *                   value: 8500
 *                 - time: "04:00"
 *                   value: 5200
 *               readPerformance:
 *                 - time: "00:00"
 *                   value: 12000
 *                 - time: "04:00"
 *                   value: 8000
 *               queryLatency:
 *                 - time: "00:00"
 *                   value: 15
 *                 - time: "04:00"
 *                   value: 12
 *               memoryUsage:
 *                 - time: "00:00"
 *                   value: 45
 *                 - time: "04:00"
 *                   value: 42
 */
export const getTimeseriesDatabaseMetrics = async (databaseId: string, timeRange: string = "24h"): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟性能指标数据
    const metrics = {
      writePerformance: [
        { time: "00:00", value: 8500 },
        { time: "04:00", value: 5200 }
      ],
      readPerformance: [
        { time: "00:00", value: 12000 },
        { time: "04:00", value: 8000 }
      ],
      queryLatency: [
        { time: "00:00", value: 15 },
        { time: "04:00", value: 12 }
      ],
      memoryUsage: [
        { time: "00:00", value: 45 },
        { time: "04:00", value: 42 }
      ]
    }
    return mockResponse(metrics)
  }
  return api.get(`/database/timeseries/${databaseId}/metrics`, { params: { timeRange } })
}