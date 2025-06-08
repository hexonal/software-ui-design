import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse } from './types'
import { config } from '../config'

// 创建 axios 实例
export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 调试信息
    console.log('API请求:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: (config.baseURL || '') + (config.url || ''),
      timeout: config.timeout
    })

    // 添加认证 token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 工具函数：检查是否是有效的Result结构
const isValidResultStructure = (data: any): boolean => {
  return data &&
    typeof data === 'object' &&
    'code' in data &&
    'message' in data &&
    typeof data.code === 'number' &&
    typeof data.message === 'string'
}

// 工具函数：创建标准错误响应
const createErrorResponse = (code: number, message: string, originalData?: any): ApiResponse<null> => {
  return {
    code,
    message,
    data: null,
    success: false,
    originalData // 保留原始数据用于调试
  }
}

// 工具函数：创建标准成功响应
const createSuccessResponse = <T>(data: T, message: string = 'success'): ApiResponse<T> => {
  return {
    code: 200,
    message,
    data,
    success: true
  }
}

// 响应拦截器 - 处理Java后端的Result<T>结构
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<ApiResponse<any>> => {
    const data = response.data
    const responseStatus = response.status

    console.log('响应拦截器 - 原始数据:', data)
    console.log('响应拦截器 - 数据类型检查:', {
      isObject: typeof data === 'object',
      isNull: data === null,
      isUndefined: data === undefined,
      isEmptyObject: data && typeof data === 'object' && Object.keys(data).length === 0,
      hasCode: data && 'code' in data,
      hasMessage: data && 'message' in data,
      hasData: data && 'data' in data,
      code: data?.code,
      message: data?.message,
      responseSize: response.headers['content-length'],
      responseStatus: response.status,
      responseStatusText: response.statusText,
      isValidResult: isValidResultStructure(data)
    })

    // 1. 处理null/undefined响应
    if (data === null || data === undefined) {
      console.warn('响应拦截器 - 检测到空响应(null/undefined)')
      response.data = createErrorResponse(500, 'API返回空响应')
      return response
    }

    // 2. 处理空对象响应
    if (typeof data === 'object' && Object.keys(data).length === 0) {
      console.warn('响应拦截器 - 检测到空对象响应')
      response.data = createErrorResponse(500, 'API返回空对象响应，可能是后端处理异常', data)
      return response
    }

    // 3. 处理非对象类型的响应（如字符串、数字、布尔值）
    if (typeof data !== 'object') {
      console.log('响应拦截器 - 检测到非对象响应，进行包装:', typeof data)
      response.data = createSuccessResponse(data, '操作成功')
      return response
    }

    // 4. 检查并处理标准的Result<T>结构
    if (isValidResultStructure(data)) {
      // 计算success字段：code为200表示成功
      const isSuccess = data.code === 200
      data.success = isSuccess

      console.log('响应拦截器 - 识别为标准Result结构:', {
        code: data.code,
        message: data.message,
        success: isSuccess,
        hasData: 'data' in data,
        dataType: typeof data.data
      })

      // 额外的状态验证和警告
      if (!isSuccess) {
        console.warn('响应拦截器 - Result结构中发现非成功状态码:', {
          code: data.code,
          message: data.message,
          httpStatus: responseStatus
        })
      }

      // 处理data字段异常的情况
      if (!('data' in data)) {
        console.warn('响应拦截器 - Result结构缺少data字段，补充null')
        data.data = null
      }

      return response
    }

    // 5. 处理类似Result但缺少某些字段的响应
    if (data && typeof data === 'object') {
      // 如果有code但没有message
      if ('code' in data && !('message' in data)) {
        console.log('响应拦截器 - 检测到包含code但缺少message的响应，进行补充')
        data.message = data.code === 200 ? 'success' : 'operation completed'
        data.success = data.code === 200
        if (!('data' in data)) {
          // 假设整个响应就是数据
          const originalData = { ...data }
          delete originalData.code
          delete originalData.message
          delete originalData.success
          data.data = Object.keys(originalData).length > 0 ? originalData : null
        }
        return response
      }

      // 如果是数组，可能是直接返回的列表数据
      if (Array.isArray(data)) {
        console.log('响应拦截器 - 检测到数组响应，包装为标准Result结构')
        response.data = createSuccessResponse(data, '获取列表成功')
        return response
      }

      // 其他对象响应，直接包装
      console.log('响应拦截器 - 检测到一般对象响应，包装为标准Result结构')
      response.data = createSuccessResponse(data, '操作成功')
      return response
    }

    // 6. 兜底处理：无法识别的响应格式
    console.warn('响应拦截器 - 无法识别的响应格式，使用兜底处理:', data)
    response.data = createErrorResponse(500, '响应格式异常，无法解析', data)
    return response
  },
  (error) => {
    // 处理错误响应
    console.error('响应拦截器 - 处理错误响应:', error)
    const response = error.response

    if (response) {
      console.error('响应拦截器 - 错误响应详情:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      })

      // 尝试从错误响应中提取有用信息
      let errorMessage = '请求失败'
      let errorCode = response.status

      if (response.data) {
        if (typeof response.data === 'string') {
          errorMessage = response.data
        } else if (typeof response.data === 'object') {
          if ('message' in response.data) {
            errorMessage = response.data.message
          } else if ('error' in response.data) {
            errorMessage = response.data.error
          } else if ('msg' in response.data) {
            errorMessage = response.data.msg
          }

          if ('code' in response.data && typeof response.data.code === 'number') {
            errorCode = response.data.code
          }
        }
      }

      // 创建标准错误响应
      const errorResponse: ApiResponse<null> = {
        code: errorCode,
        message: errorMessage || `HTTP ${response.status}: ${response.statusText}`,
        data: null,
        success: false,
        originalData: response.data
      }

      response.data = errorResponse
      return Promise.reject(error)
    } else if (error.request) {
      // 网络错误或超时
      console.error('响应拦截器 - 网络错误:', error.message)
      const networkError: ApiResponse<null> = {
        code: 0,
        message: error.code === 'ECONNABORTED' ? '请求超时' : `网络错误: ${error.message}`,
        data: null,
        success: false,
        originalData: { error: error.message, code: error.code }
      }

      // 创建一个模拟的响应
      error.response = {
        data: networkError,
        status: 0,
        statusText: 'Network Error',
        headers: {},
        config: error.config
      }
      return Promise.reject(error)
    } else {
      // 其他类型的错误
      console.error('响应拦截器 - 其他错误:', error.message)
      const otherError: ApiResponse<null> = {
        code: -1,
        message: `请求配置错误: ${error.message}`,
        data: null,
        success: false,
        originalData: { error: error.message }
      }

      // 创建一个模拟的响应
      error.response = {
        data: otherError,
        status: -1,
        statusText: 'Config Error',
        headers: {},
        config: error.config
      }
      return Promise.reject(error)
    }
  }
)

// 通用请求方法
export const request = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api(config)
    const result = response.data as ApiResponse<T>

    if (!result.success) {
      throw result
    }

    return result.data as T
  } catch (error) {
    throw error
  }
}

// 导出常用方法
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
}

export default apiClient