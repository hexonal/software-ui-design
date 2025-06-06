import { api } from '@/lib/api/client'
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
  return api.get(`/dfm/database/timeseries/${id}`)
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
  return api.post('/dfm/database/timeseries', data)
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
 *                 displayName: "CPU使用率"
 *                 category: "系统监控"
 *                 unit: "percentage"
 *                 description: "CPU使用率监控数据"
 */
export const getTimeseries = async (databaseId: string, params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/database/timeseries/${databaseId}/series`, { params })
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
 *             properties:
 *               name:
 *                 type: string
 *               displayName:
 *                 type: string
 *               category:
 *                 type: string
 *               unit:
 *                 type: string
 *           example:
 *             name: "new_metric"
 *             displayName: "新指标"
 *             category: "自定义"
 *             unit: "count"
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createTimeseries = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/timeseries/${databaseId}/series`, data)
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
 */
export const deleteTimeseries = async (databaseId: string, seriesName: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/database/timeseries/${databaseId}/series/${seriesName}`)
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
 *             query: "SELECT mean(value) FROM cpu_usage WHERE time >= now() - 1h GROUP BY time(10m)"
 *     responses:
 *       200:
 *         description: 查询结果
 *         content:
 *           application/json:
 *             example:
 *               query: "SELECT mean(value) FROM cpu_usage WHERE time >= now() - 1h GROUP BY time(10m)"
 *               executionTime: "0.045 秒"
 *               rowCount: 150
 *               columns: ["time", "value", "tags"]
 */
export const executeTimeseriesQuery = async (databaseId: string, query: string): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/timeseries/${databaseId}/query`, { query })
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
 *               isDefault:
 *                 type: boolean
 *           example:
 *             name: "weekly"
 *             duration: "7d"
 *             isDefault: false
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createRetentionPolicy = async (databaseId: string, data: any): Promise<ApiResponse<any>> => {
  return api.post(`/dfm/database/timeseries/${databaseId}/retention-policies`, data)
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
 *               - name: "default"
 *                 displayName: "默认策略"
 *                 duration: "30d"
 *                 isDefault: true
 */
export const getRetentionPolicies = async (databaseId: string): Promise<ApiResponse<any[]>> => {
  return api.get(`/dfm/database/timeseries/${databaseId}/retention-policies`)
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
 *         schema:
 *           type: string
 *           default: "24h"
 *     responses:
 *       200:
 *         description: 性能指标
 *         content:
 *           application/json:
 *             example:
 *               writeRate: 1500.0
 *               queryRate: 800.0
 *               diskUsage: "2.3 GB"
 *               memoryUsage: "512 MB"
 */
export const getTimeseriesDatabaseMetrics = async (databaseId: string, timeRange: string = "24h"): Promise<ApiResponse<any>> => {
  return api.get(`/dfm/database/timeseries/${databaseId}/metrics`, { params: { timeRange } })
}