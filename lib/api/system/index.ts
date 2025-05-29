import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

// 获取系统设置
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

// 更新系统设置
export const updateSystemSettings = async (data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse(data)
  }
  
  return api.put('/system/settings', data)
}

// 获取系统日志
export const getSystemLogs = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 返回模拟的系统日志数据
    const logs = getMockData('systemLogs')
    
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

// 获取系统告警
export const getSystemAlerts = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 返回模拟的系统告警数据
    const alerts = getMockData('systemAlerts')
    
    // 处理搜索和过滤
    let filteredAlerts = [...alerts]
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.title.toLowerCase().includes(searchLower) || 
        alert.message.toLowerCase().includes(searchLower)
      )
    }
    
    if (params?.filter) {
      if (params.filter.severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === params.filter.severity)
      }
      if (params.filter.acknowledged !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => alert.acknowledged === params.filter.acknowledged)
      }
    }
    
    return mockResponse(filteredAlerts)
  }
  
  return api.get('/dfm/system/alerts', { params })
}

// 确认告警
export const acknowledgeAlert = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    // 更新模拟数据中的告警状态
    const alerts = getMockData('systemAlerts') as any[];
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].acknowledged = true;
    }
    
    return mockResponse(true)
  }
  
  return api.put(`/dfm/system/alerts/${id}/acknowledge`)
}

// 解决告警
export const resolveAlert = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    // 更新模拟数据中的告警状态
    const alerts = getMockData('systemAlerts') as any[];
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].resolved = true;
      alerts[alertIndex].resolvedAt = new Date();
    }
    
    return mockResponse(true)
  }
  
  return api.put(`/dfm/system/alerts/${id}/resolve`)
}

// 获取系统性能数据
export const getSystemPerformance = async (timeRange?: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 返回模拟的系统性能数据
    return mockResponse(getMockData('performanceData'))
  }
  
  return api.get('/dfm/system/performance', { params: { timeRange } })
}

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

export const getSidebarNavItems = async (): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 这里直接返回原 navItems 结构
    return mockResponse([
      // ... existing code ...
    ])
  }
  // 真实 API 可根据实际后端实现调整
  return api.get('/dfm/system/sidebar-nav')
}