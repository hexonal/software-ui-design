import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import * as mockAlertsApi from "@/mock/dashboard/system/alerts"

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
 */
export const getSystemSettings = async (): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({
      general: {
        systemName: "分布式融合数据库与存储管理系统",
        version: "1.0.0",
        maxConnections: 100,
        queryTimeout: 30,
        bufferSize: 1024,
        workerThreads: 8
      },
      security: {
        sslEnabled: true,
        autoLogout: true,
        auditLogging: true
      },
      backup: {
        backupPath: "/data/backups",
        retention: "30",
        schedule: "daily",
        compression: true,
        encryption: true
      }
    })
  }
  
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
 *             type: object
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateSystemSettings = async (data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse(data)
  }
  
  return api.put('/dfm/system/settings', data)
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
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 日志列表
 */
export const getSystemLogs = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 返回模拟的系统日志数据
    const logs = getMockData('systemLogs') as any[]
    
    // 处理搜索和过滤
    let filteredLogs = [...logs]
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchLower) || 
        log.source.toLowerCase().includes(searchLower)
      )
    }
    
    if (params?.filter) {
      if (params.filter.level) {
        filteredLogs = filteredLogs.filter(log => log.level === params.filter.level)
      }
      if (params.filter.source) {
        filteredLogs = filteredLogs.filter(log => log.source === params.filter.source)
      }
    }
    
    return mockResponse(filteredLogs)
  }
  
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
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 告警列表
 */
export const getSystemAlerts = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 返回模拟的系统告警数据
    const alerts = getMockData('systemAlerts') as any[]
    
    // 处理搜索和过滤
    let filteredAlerts = [...alerts]
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.message.toLowerCase().includes(searchLower) || 
        alert.source.toLowerCase().includes(searchLower)
      )
    }
    
    if (params?.filter) {
      if (params.filter.level) {
        filteredAlerts = filteredAlerts.filter(alert => alert.level === params.filter.level)
      }
      if (params.filter.source) {
        filteredAlerts = filteredAlerts.filter(alert => alert.source === params.filter.source)
      }
    }
    
    return mockResponse(filteredAlerts)
  }
  
  return api.get('/dfm/system/alerts', { params })
}

// 获取告警规则
export const getAlertRules = async () => {
  return mockAlertsApi.getAlertRules()
}

// 获取通知渠道
export const getAlertChannels = async () => {
  return mockAlertsApi.getAlertChannels()
}

// 确认告警
export const acknowledgeAlert = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    // 这里暂时直接返回 true，后续可在 mock 层实现状态变更
    return mockResponse(true)
  }
  return api.put(`/dfm/system/alerts/${id}/acknowledge`)
}

// 解决告警
export const resolveAlert = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    // 这里暂时直接返回 true，后续可在 mock 层实现状态变更
    return mockResponse(true)
  }
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
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 性能数据
 */
export const getSystemPerformance = async (timeRange?: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 返回模拟的系统性能数据
    return mockResponse({
      cpu: {
        current: 78,
        history: [45, 40, 35, 30, 32, 35, 42, 55, 70, 85, 82, 80, 78]
      },
      memory: {
        current: 72,
        history: [60, 58, 55, 52, 50, 53, 58, 65, 72, 80, 78, 75, 72]
      },
      disk: {
        current: 53,
        history: [35, 37, 38, 36, 35, 34, 36, 40, 45, 50, 52, 55, 53]
      },
      network: {
        current: 55,
        history: [20, 25, 22, 18, 15, 20, 25, 35, 50, 65, 60, 58, 55]
      },
      timeLabels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"]
    })
  }
  
  return api.get('/dfm/system/performance', { params: { timeRange } })
}

export const addAlertRule = mockAlertsApi.addAlertRule
export const updateAlertRule = mockAlertsApi.updateAlertRule
export const deleteAlertRule = mockAlertsApi.deleteAlertRule

export const addAlertChannel = mockAlertsApi.addAlertChannel
export const updateAlertChannel = mockAlertsApi.updateAlertChannel
export const deleteAlertChannel = mockAlertsApi.deleteAlertChannel

/**
 * @openapi
 * /system/sidebar-nav:
 *   get:
 *     summary: 获取侧边栏导航项
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 侧边栏导航项
 */
export const getSidebarNavItems = async (): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 这里直接返回原 navItems 结构
    return mockResponse([
      {
        title: "总览",
        href: "/dashboard",
        icon: "Activity",
        exact: true,
      },
      {
        title: "数据库管理",
        icon: "Database",
        items: [
          { title: "数据库总览", href: "/dashboard/database", icon: "Database", exact: true },
          { title: "关系型数据库", href: "/dashboard/database/relational", icon: "Table" },
          { title: "时序数据库", href: "/dashboard/database/timeseries", icon: "Clock" },
          { title: "向量数据库", href: "/dashboard/database/vector", icon: "Vector" },
          { title: "地理空间数据库", href: "/dashboard/database/geospatial", icon: "Map" },
        ],
      },
      {
        title: "集群管理",
        icon: "Server",
        items: [
          { title: "节点管理", href: "/dashboard/cluster/nodes", icon: "Server" },
          { title: "分片管理", href: "/dashboard/cluster/shards", icon: "Layers" },
        ],
      },
      {
        title: "数据模型管理",
        icon: "Table",
        items: [
          { title: "表结构管理", href: "/dashboard/data-model/tables", icon: "Table" },
          { title: "数据导入导出", href: "/dashboard/data-model/import-export", icon: "Upload" },
        ],
      },
      {
        title: "安全管理",
        icon: "Shield",
        items: [
          { title: "用户权限管理", href: "/dashboard/security/users", icon: "Users" },
          { title: "访问控制", href: "/dashboard/security/access-control", icon: "Key" },
        ],
      },
      {
        title: "监控与维护",
        icon: "BarChart",
        items: [
          { title: "性能监控", href: "/dashboard/monitoring/performance", icon: "BarChart" },
          { title: "备份管理", href: "/dashboard/monitoring/backup", icon: "Save" },
        ],
      },
      {
        title: "存储管理",
        icon: "HardDrive",
        items: [
          { title: "存储总览", href: "/dashboard/storage", icon: "HardDrive", exact: true },
          { title: "文件存储", href: "/dashboard/storage/file", icon: "FolderTree" },
          { title: "对象存储", href: "/dashboard/storage/object", icon: "Package" },
          { title: "块存储", href: "/dashboard/storage/block", icon: "HardDisk" },
        ],
      },
      {
        title: "系统管理",
        icon: "Settings",
        items: [
          { title: "系统设置", href: "/dashboard/system/settings", icon: "Settings" },
          { title: "日志管理", href: "/dashboard/system/logs", icon: "FileText" },
          { title: "告警管理", href: "/dashboard/system/alerts", icon: "Bell" },
        ],
      },
    ])
  }
  // 真实 API 可根据实际后端实现调整
  return api.get('/dfm/system/sidebar-nav')
}

/**
 * @openapi
 * /system/status:
 *   get:
 *     summary: 获取系统状态（仪表盘）
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: 系统状态
 */
export const getSystemStatus = async (): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({
      health: { value: "良好", description: "所有系统正常运行", status: "success" },
      storage: { value: "42%", description: "已使用 4.2TB / 10TB", status: "warning" },
      nodes: { value: "18/20", description: "18 个节点在线", status: "success" },
      databases: { value: "12/15", description: "3 个实例需要注意", status: "warning" }
    })
  }
  return api.get('/dfm/system/status')
}