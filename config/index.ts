// 全局配置
export const config = {
  // API 配置
  api: {
    // 基础 URL - 确保使用完整的 URL 或有效的相对路径
    baseUrl: 'https://api-frp.ipv4.name',
    // 超时时间（毫秒）
    timeout: 10000,
    // 重试次数
    retries: 3,
  },
  // 分页配置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
}