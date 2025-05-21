module.exports = {
  openapi: '3.0.0',
  info: {
    title: '软件平台前端 API',
    version: '1.0.0',
    description: '前端聚合 API 自动生成的 OpenAPI 文档'
  },
  servers: [
    { url: 'http://localhost:3000/api' }
  ],
  components: {
    schemas: {
      Node: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '节点唯一标识', example: 'node-1' },
          name: { type: 'string', description: '节点名称', example: '主节点A' },
          ip: { type: 'string', description: '节点 IP 地址', example: '192.168.1.10' },
          role: { type: 'string', description: '节点角色', example: 'master' },
          status: { type: 'string', description: '节点状态', example: 'active' },
          cpu: { type: 'number', description: 'CPU 核数', example: 8 },
          memory: { type: 'number', description: '内存大小(GB)', example: 32 },
          disk: { type: 'number', description: '磁盘容量(GB)', example: 1024 }
        },
        required: ['id', 'name', 'ip', 'role', 'status', 'cpu', 'memory', 'disk'],
        description: '集群节点对象'
      },
      Shard: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '分片唯一标识', example: 'shard-1' },
          range: { type: 'string', description: '分片数据范围', example: '0-1000' },
          nodeId: { type: 'string', description: '所属节点ID', example: 'node-1' },
          status: { type: 'string', description: '分片状态', example: 'active' },
          size: { type: 'string', description: '分片大小', example: '100GB' },
          usage: { type: 'number', description: '分片使用率(%)', example: 75 },
          replicas: { type: 'number', description: '副本数', example: 3 }
        },
        required: ['id', 'range', 'nodeId', 'status', 'size', 'usage', 'replicas'],
        description: '集群分片对象'
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '用户唯一标识', example: 'user-1' },
          username: { type: 'string', description: '用户名', example: 'admin' },
          email: { type: 'string', description: '邮箱', example: 'admin@example.com' },
          role: { type: 'string', description: '用户角色', example: '管理员' },
          status: { type: 'string', description: '用户状态', example: 'active' },
          lastLogin: { type: 'string', description: '上次登录时间', example: '2024-05-01T12:00:00Z' }
        },
        required: ['id', 'username', 'email', 'role', 'status', 'lastLogin'],
        description: '平台用户对象'
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '角色唯一标识', example: 'role-1' },
          name: { type: 'string', description: '角色名称', example: '管理员' },
          description: { type: 'string', description: '角色描述', example: '拥有所有权限' },
          users: { type: 'number', description: '关联用户数', example: 5 },
          permissions: { type: 'string', description: '权限列表', example: 'read,write,delete' }
        },
        required: ['id', 'name', 'description', 'users', 'permissions'],
        description: '平台角色对象'
      },
      Database: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '数据库唯一标识', example: 'db-1' },
          name: { type: 'string', description: '数据库名称', example: 'testdb' },
          charset: { type: 'string', description: '字符集', example: 'utf8mb4' },
          collation: { type: 'string', description: '排序规则', example: 'utf8mb4_general_ci' },
          size: { type: 'string', description: '数据库大小', example: '10GB' },
          tables: { type: 'number', description: '表数量', example: 12 },
          retention: { type: 'string', description: '数据保留策略', example: '30d' },
          series: { type: 'number', description: '时序序列数', example: 1000 },
          points: { type: 'string', description: '数据点数量', example: '1000000' },
          status: { type: 'string', description: '数据库状态', example: 'active' }
        },
        required: ['id', 'name', 'size'],
        description: '数据库对象'
      }
    }
  }
}; 