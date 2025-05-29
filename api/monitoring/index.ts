import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { BackupHistory, BackupSchedule } from '@/mock/dashboard/types'

/**
 * @openapi
 * /monitoring/backup/history:
 *   get:
 *     summary: 获取备份历史
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: 备份历史列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BackupHistory'
 *             example:
 *               - id: "backup-001"
 *                 name: "每日自动备份"
 *                 type: "自动"
 *                 status: "成功"
 *                 size: "2.4 GB"
 *                 startTime: "2023-05-10 00:00:00"
 *                 endTime: "2023-05-10 00:45:22"
 *                 duration: "45分钟"
 *               - id: "backup-002"
 *                 name: "每周完整备份"
 *                 type: "自动"
 *                 status: "成功"
 *                 size: "8.7 GB"
 *                 startTime: "2023-05-07 01:00:00"
 *                 endTime: "2023-05-07 02:35:15"
 *                 duration: "1小时35分钟"
 */
export const getBackupHistory = async (params?: QueryParams): Promise<ApiResponse<BackupHistory[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('backupHistory') as BackupHistory[])
  }
  
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
 *             example:
 *               id: "backup-001"
 *               name: "每日自动备份"
 *               type: "自动"
 *               status: "成功"
 *               size: "2.4 GB"
 *               startTime: "2023-05-10 00:00:00"
 *               endTime: "2023-05-10 00:45:22"
 *               duration: "45分钟"
 */
export const getBackupHistoryById = async (id: string): Promise<ApiResponse<BackupHistory | null>> => {
  if (useMock()) {
    const history = getMockData('backupHistory') as BackupHistory[]
    const backup = history.find(b => b.id === id)
    
    if (!backup) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(backup)
  }
  
  return api.get(`/monitoring/backup/history/${id}`)
}

/**
 * @openapi
 * /monitoring/backup/schedules:
 *   get:
 *     summary: 获取备份计划
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: 备份计划列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BackupSchedule'
 *             example:
 *               - id: "schedule-001"
 *                 name: "每日增量备份"
 *                 type: "增量"
 *                 schedule: "每天 00:00"
 *                 target: "所有数据库"
 *                 retention: "7天"
 *                 status: "启用"
 *                 lastRun: "2023-05-10 00:00:00"
 *                 nextRun: "2023-05-11 00:00:00"
 *               - id: "schedule-002"
 *                 name: "每周完整备份"
 *                 type: "完整"
 *                 schedule: "每周日 01:00"
 *                 target: "所有数据库"
 *                 retention: "4周"
 *                 status: "启用"
 *                 lastRun: "2023-05-07 01:00:00"
 *                 nextRun: "2023-05-14 01:00:00"
 */
export const getBackupSchedules = async (params?: QueryParams): Promise<ApiResponse<BackupSchedule[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('backupSchedules') as BackupSchedule[])
  }
  
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
 *             example:
 *               id: "schedule-001"
 *               name: "每日增量备份"
 *               type: "增量"
 *               schedule: "每天 00:00"
 *               target: "所有数据库"
 *               retention: "7天"
 *               status: "启用"
 *               lastRun: "2023-05-10 00:00:00"
 *               nextRun: "2023-05-11 00:00:00"
 */
export const getBackupScheduleById = async (id: string): Promise<ApiResponse<BackupSchedule | null>> => {
  if (useMock()) {
    const schedules = getMockData('backupSchedules') as BackupSchedule[]
    const schedule = schedules.find(s => s.id === id)
    
    if (!schedule) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(schedule)
  }
  
  return api.get(`/monitoring/backup/schedules/${id}`)
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
 *             example:
 *               id: "schedule-001"
 *               name: "每日增量备份"
 *               type: "增量"
 *               schedule: "每天 00:00"
 *               target: "所有数据库"
 *               retention: "7天"
 *               status: "启用"
 *               lastRun: "2023-05-10 00:00:00"
 *               nextRun: "2023-05-11 00:00:00"
 */
export const createBackupSchedule = async (data: Omit<BackupSchedule, 'id'>): Promise<ApiResponse<BackupSchedule>> => {
  if (useMock()) {
    // 模拟创建备份计划
    const newSchedule: BackupSchedule = {
      id: `schedule-${Date.now()}`,
      ...data
    }
    return mockResponse(newSchedule)
  }
  
  return api.post('/monitoring/backup/schedules', data)
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
 *             example:
 *               id: "schedule-001"
 *               name: "每日增量备份"
 *               type: "增量"
 *               schedule: "每天 00:00"
 *               target: "所有数据库"
 *               retention: "7天"
 *               status: "启用"
 *               lastRun: "2023-05-10 00:00:00"
 *               nextRun: "2023-05-11 00:00:00"
 */
export const updateBackupSchedule = async (id: string, data: Partial<BackupSchedule>): Promise<ApiResponse<BackupSchedule>> => {
  if (useMock()) {
    const schedules = getMockData('backupSchedules') as BackupSchedule[]
    const scheduleIndex = schedules.findIndex(s => s.id === id)
    
    if (scheduleIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedSchedule = { ...schedules[scheduleIndex], ...data }
    return mockResponse(updatedSchedule)
  }
  
  return api.put(`/monitoring/backup/schedules/${id}`, data)
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
 *             example:
 *               success: true
 */
export const deleteBackupSchedule = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/monitoring/backup/schedules/${id}`)
}

/**
 * @openapi
 * /monitoring/backup/manual:
 *   post:
 *     summary: 执行手动备份
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
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: 备份任务
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackupHistory'
 *             example:
 *               id: "backup-006"
 *               name: "手动备份"
 *               type: "手动"
 *               status: "成功"
 *               size: "3.2 GB"
 *               startTime: "2023-05-11 10:00:00"
 *               endTime: "2023-05-11 10:30:00"
 *               duration: "30分钟"
 */
export const createManualBackup = async (data: { name: string, type: string }): Promise<ApiResponse<BackupHistory>> => {
  if (useMock()) {
    // 模拟创建手动备份
    const newBackup: BackupHistory = {
      id: `backup-${Date.now()}`,
      name: data.name,
      type: '手动',
      status: '成功',
      size: '3.2 GB',
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      endTime: new Date(Date.now() + 1000 * 60 * 30).toISOString().replace('T', ' ').substring(0, 19),
      duration: '30分钟'
    }
    return mockResponse(newBackup)
  }
  
  return api.post('/monitoring/backup/manual', data)
}

/**
 * @openapi
 * /monitoring/performance:
 *   get:
 *     summary: 获取性能数据
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - name: timeRange
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 性能数据
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   cpu:
 *                     type: integer
 *                   memory:
 *                     type: integer
 *                   disk:
 *                     type: integer
 *                   network:
 *                     type: integer
 *             example:
 *               - name: "00:00"
 *                 cpu: 65
 *                 memory: 55
 *                 disk: 40
 *                 network: 70
 *               - name: "01:00"
 *                 cpu: 70
 *                 memory: 60
 *                 disk: 45
 *                 network: 65
 */
export const getPerformanceData = async (params?: { timeRange?: string }): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse(getMockData('performanceData'))
  }
  
  return api.get('/dfm/monitoring/performance', { params })
}