// 应用配置
export const config = {
  api: {
    // API基础URL - 使用相对路径，通过nginx代理
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',

    // 请求超时时间 - 增加到30秒
    timeout: 30000,
  },

  // JWT配置
  jwt: {
    tokenKey: 'auth_token',
    // Token过期时间检查间隔(ms)
    checkInterval: 5 * 60 * 1000, // 5分钟
  },

  // 应用信息
  app: {
    name: 'DFMS - 分布式数据库管理系统',
    version: '1.0.0',
  }
}

// 环境检测
export const isDevelopment = () => {
  return typeof window !== 'undefined' && (window as any).location?.hostname === 'localhost'
}

// API端点配置
export const endpoints = {
  // 用户相关
  user: {
    login: '/user/login',
    logout: '/user/logout',
    info: '/user/info',
  },

  // 数据库相关
  database: {
    list: '/database',
    detail: (id: string) => `/database/${id}`,
    create: '/database',
    update: (id: string) => `/database/${id}`,
    delete: (id: string) => `/database/${id}`,
    query: (id: string) => `/database/${id}/query`,
  },

  // 集群相关
  cluster: {
    nodes: '/cluster/nodes',
    nodeDetail: (id: string) => `/cluster/nodes/${id}`,
    shards: '/cluster/shards',
    shardDetail: (id: string) => `/cluster/shards/${id}`,
  },

  // 安全相关
  security: {
    users: '/security/users',
    roles: '/security/roles',
    policies: '/security/access-policies',
  }
} 