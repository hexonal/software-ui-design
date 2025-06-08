import { api } from '@/lib/api/client'
import { ApiResponse, QueryParams } from '@/lib/api/types'

/**
 * @openapi
 * /system/settings:
 *   get:
 *     summary: 获取系统设置
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 系统设置
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SystemSettings'
 */
export const getSystemSettings = async (): Promise<ApiResponse<any>> => {
  return api.get('/dfm/system/settings')
}

/**
 * @openapi
 * /system/settings:
 *   put:
 *     summary: 更新系统设置
 *     tags:
 *       - System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SystemSettings'
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateSystemSettings = async (settings: any): Promise<ApiResponse<any>> => {
  return api.put('/dfm/system/settings', settings)
}

/**
 * @openapi
 * /system/logs:
 *   get:
 *     summary: 获取系统日志
 *     tags:
 *       - System
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - name: level
 *         in: query
 *         schema:
 *           type: string
 *         description: 日志级别
 *       - name: source
 *         in: query
 *         schema:
 *           type: string
 *         description: 日志来源
 *     responses:
 *       200:
 *         description: 系统日志列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SystemLog'
 */
export const getSystemLogs = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/logs', { params })
}

/**
 * @openapi
 * /system/alerts:
 *   get:
 *     summary: 获取系统告警
 *     tags:
 *       - System
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - name: level
 *         in: query
 *         schema:
 *           type: string
 *         description: 告警级别
 *       - name: source
 *         in: query
 *         schema:
 *           type: string
 *         description: 告警来源
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: 告警状态
 *     responses:
 *       200:
 *         description: 系统告警列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SystemAlert'
 */
export const getSystemAlerts = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/alerts', { params })
}

/**
 * @openapi
 * /system/alerts/{id}/acknowledge:
 *   put:
 *     summary: 确认告警
 *     tags:
 *       - System
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 确认成功
 */
export const acknowledgeAlert = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.put(`/dfm/system/alerts/${id}/acknowledge`)
}

/**
 * @openapi
 * /system/alerts/{id}/resolve:
 *   put:
 *     summary: 解决告警
 *     tags:
 *       - System
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 解决成功
 */
export const resolveAlert = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.put(`/dfm/system/alerts/${id}/resolve`)
}

/**
 * @openapi
 * /system/performance:
 *   get:
 *     summary: 获取系统性能数据
 *     tags:
 *       - System
 *     parameters:
 *       - name: timeRange
 *         in: query
 *         schema:
 *           type: string
 *           default: "24h"
 *         description: 时间范围
 *     responses:
 *       200:
 *         description: 系统性能数据
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerformanceData'
 */
export const getSystemPerformance = async (timeRange?: string): Promise<ApiResponse<any>> => {
  return api.get('/dfm/system/performance', {
    params: timeRange ? { timeRange } : undefined
  })
}

/**
 * @openapi
 * /system/status:
 *   get:
 *     summary: 获取系统状态
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 系统状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overall:
 *                   type: string
 *                   example: "healthy"
 *                 uptime:
 *                   type: string
 *                   example: "15天3小时42分钟"
 *                 services:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                 resources:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 */
export const getSystemStatus = async (): Promise<ApiResponse<any>> => {
  return api.get('/dfm/system/status')
}

/**
 * @openapi
 * /system/sidebar-nav:
 *   get:
 *     summary: 获取侧边栏导航
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 侧边栏导航数据
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   href:
 *                     type: string
 *                   icon:
 *                     type: string
 *                   children:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/SidebarNavItem'
 */
export const getSidebarNav = async (): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/sidebar-nav')
}

// =============================================== 告警规则管理接口 ===============================================

/**
 * @openapi
 * /system/alert-rules:
 *   get:
 *     summary: 获取告警规则列表
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 告警规则列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlertRule'
 */
export const getAlertRules = async (): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/alert-rules')
}

/**
 * @openapi
 * /system/alert-rules:
 *   post:
 *     summary: 添加告警规则
 *     tags:
 *       - System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlertRule'
 *     responses:
 *       200:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlertRule'
 */
export const addAlertRule = async (ruleData: any): Promise<ApiResponse<any>> => {
  return api.post('/dfm/system/alert-rules', ruleData)
}

/**
 * @openapi
 * /system/alert-rules/{id}:
 *   put:
 *     summary: 更新告警规则
 *     tags:
 *       - System
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
 *             $ref: '#/components/schemas/AlertRule'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AlertRule'
 */
export const updateAlertRule = async (id: string, ruleData: any): Promise<ApiResponse<any>> => {
  return api.put(`/dfm/system/alert-rules/${id}`, ruleData)
}

/**
 * @openapi
 * /system/alert-rules/{id}:
 *   delete:
 *     summary: 删除告警规则
 *     tags:
 *       - System
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
export const deleteAlertRule = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/system/alert-rules/${id}`)
}

/**
 * @openapi
 * /system/alert-channels:
 *   get:
 *     summary: 获取告警渠道列表
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 告警渠道列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AlertChannel'
 */
export const getAlertChannels = async (): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/system/alert-channels')
}