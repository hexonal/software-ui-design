import * as mockData from '@/mock/dashboard'
import { ApiResponse } from './types'
import { config, isDevelopment } from '../config'

// 模拟 API 延迟
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟 API 响应 - 符合Java后端Result<T>结构
export const mockResponse = async <T>(data: T, error = false, errorStatus = 500): Promise<ApiResponse<T>> => {
  // 模拟网络延迟
  await simulateDelay()
  
  // 如果需要模拟错误
  if (error) {
    throw {
      code: errorStatus,
      message: '模拟的 API 错误',
      data: null,
      success: false
    }
  }
  
  // 返回成功响应 - 符合Java后端Result<T>结构
  return {
    code: 200,
    message: 'success',
    data,
    success: true
  }
}

// 检查是否使用 mock 数据
export const useMock = (): boolean => {
  // 优先使用配置文件设置
  return config.api.useMock || isDevelopment()
}

// 获取 mock 数据
export const getMockData = (key: keyof typeof mockData) => {
  return mockData[key]
}

// 设置 mock 数据
export const setMockData = (key: keyof typeof mockData, data: any) => {
  (mockData as any)[key] = data
}