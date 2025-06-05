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
    // 添加认证 token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理Java后端的Result<T>结构
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<ApiResponse<any>> => {
    const data = response.data
    
    // 如果后端返回的是标准的Result<T>结构
    if (data && typeof data === 'object' && 'code' in data && 'message' in data) {
      // 计算success字段：code为200表示成功
      data.success = data.code === 200
      return response
    }
    
    // 如果不是标准结构，包装为标准结构
    response.data = {
      code: 200,
      message: 'success',
      data: data,
      success: true
    }
    
    return response
  },
  (error) => {
    // 处理错误响应
    const response = error.response
    if (response) {
      const errorData: ApiResponse<null> = {
        code: response.status,
        message: response.data?.message || error.message || '请求失败',
        data: null,
        success: false
      }
      
      // 401 未授权，清除token并跳转到登录页
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        // 如果在浏览器环境，跳转到登录页
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      
      return Promise.reject(errorData)
    }
    
    return Promise.reject({
      code: 0,
      message: error.message || '网络错误',
      data: null,
      success: false
    })
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