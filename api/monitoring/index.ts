import { api } from '@/lib/api/client'
import { ApiResponse, QueryParams } from '@/lib/api/types'
import { BackupHistory, BackupSchedule } from '@/lib/types'

/**
 * @openapi
 * /monitoring/backup/history:
 *   get:
 *     summary: 获取备份历史记录
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *         description: 备份类型
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: 备份状态
 *     responses:
 *       200:
 *         description: 备份历史记录列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BackupHistory'
 */
export const getBackupHistory = async (params?: QueryParams): Promise<ApiResponse<BackupHistory[]>> => {
  return api.get('/dfm/monitoring/backup/history', { params })
}

/**
 * @openapi
 * /monitoring/backup/history/{id}:
 *   get:
 *     summary: 获取备份历史详情
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 备份历史详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupHistory'
 */
export const getBackupHistoryById = async (id: string): Promise<ApiResponse<BackupHistory | null>> => {
  return api.get(`/dfm/monitoring/backup/history/${id}`)
}

/**
 * @openapi
 * /monitoring/backup/schedules:
 *   get:
 *     summary: 获取备份计划列表
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: 计划状态
 *     responses:
 *       200:
 *         description: 备份计划列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BackupSchedule'
 */
export const getBackupSchedules = async (params?: QueryParams): Promise<ApiResponse<BackupSchedule[]>> => {
  return api.get('/dfm/monitoring/backup/schedules', { params })
}

/**
 * @openapi
 * /monitoring/backup/schedules/{id}:
 *   get:
 *     summary: 获取备份计划详情
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 备份计划详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupSchedule'
 */
export const getBackupScheduleById = async (id: string): Promise<ApiResponse<BackupSchedule | null>> => {
  return api.get(`/dfm/monitoring/backup/schedules/${id}`)
}

/**
 * @openapi
 * /monitoring/backup/schedules:
 *   post:
 *     summary: 创建备份计划
 *     tags:
 *       - Monitoring
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BackupSchedule'
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupSchedule'
 */
export const createBackupSchedule = async (data: Omit<BackupSchedule, 'id'>): Promise<ApiResponse<BackupSchedule>> => {
  return api.post('/dfm/monitoring/backup/schedules', data)
}

/**
 * @openapi
 * /monitoring/backup/schedules/{id}:
 *   put:
 *     summary: 更新备份计划
 *     tags:
 *       - Monitoring
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
 *             $ref: '#/components/schemas/BackupSchedule'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupSchedule'
 */
export const updateBackupSchedule = async (id: string, data: Partial<BackupSchedule>): Promise<ApiResponse<BackupSchedule | null>> => {
  return api.put(`/dfm/monitoring/backup/schedules/${id}`, data)
}

/**
 * @openapi
 * /monitoring/backup/schedules/{id}:
 *   delete:
 *     summary: 删除备份计划
 *     tags:
 *       - Monitoring
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
export const deleteBackupSchedule = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/monitoring/backup/schedules/${id}`)
}

/**
 * @openapi
 * /monitoring/backup/manual:
 *   post:
 *     summary: 创建手动备份
 *     tags:
 *       - Monitoring
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 备份名称
 *               type:
 *                 type: string
 *                 description: 备份类型
 *               target:
 *                 type: string
 *                 description: 备份目标
 *               description:
 *                 type: string
 *                 description: 备份描述
 *     responses:
 *       200:
 *         description: 手动备份创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupHistory'
 */
export const createManualBackup = async (data: any): Promise<ApiResponse<BackupHistory>> => {
  return api.post('/dfm/monitoring/backup/manual', data)
}

/**
 * @openapi
 * /monitoring/performance:
 *   get:
 *     summary: 获取性能监控数据
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - name: timeRange
 *         in: query
 *         schema:
 *           type: string
 *           default: "24h"
 *         description: 时间范围
 *       - name: metrics
 *         in: query
 *         schema:
 *           type: string
 *         description: 指标类型
 *     responses:
 *       200:
 *         description: 性能监控数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cpu:
 *                   type: object
 *                 memory:
 *                   type: object
 *                 disk:
 *                   type: object
 *                 network:
 *                   type: object
 */
export const getPerformanceData = async (timeRange?: string, metrics?: string): Promise<ApiResponse<any>> => {
  return api.get('/dfm/monitoring/performance', {
    params: { timeRange, metrics }
  })
}