// 应用配置
export const config = {
  api: {
    // API基础URL
    baseUrl: typeof window !== 'undefined' && (window as any).location
      ? `${(window as any).location.protocol}//${(window as any).location.hostname}:8080`
      : 'http://localhost:8080',

    // 请求超时时间
    timeout: 10000,
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
    login: '/dfm/user/login',
    logout: '/dfm/user/logout',
    info: '/dfm/user/info',
  },

  // 数据库相关
  database: {
    list: '/dfm/database',
    detail: (id: string) => `/dfm/database/${id}`,
    create: '/dfm/database',
    update: (id: string) => `/dfm/database/${id}`,
    delete: (id: string) => `/dfm/database/${id}`,
    query: (id: string) => `/dfm/database/${id}/query`,
  },

  // 集群相关
  cluster: {
    nodes: '/dfm/cluster/nodes',
    nodeDetail: (id: string) => `/dfm/cluster/nodes/${id}`,
    shards: '/dfm/cluster/shards',
    shardDetail: (id: string) => `/dfm/cluster/shards/${id}`,
  },

  // 安全相关
  security: {
    users: '/dfm/security/users',
    roles: '/dfm/security/roles',
    policies: '/dfm/security/access-policies',
  }
} 