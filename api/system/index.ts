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
 * /system/change-password:
 *   post:
 *     summary: 修改管理员密码
 *     tags:
 *       - System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: 当前密码
 *               newPassword:
 *                 type: string
 *                 description: 新密码
 *               confirmPassword:
 *                 type: string
 *                 description: 确认新密码
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: 密码修改结果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export const changeAdminPassword = async (passwordData: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ApiResponse<any>> => {
  return api.post('/dfm/system/change-password', passwordData)
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

