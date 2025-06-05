import { api } from './client'
import { ApiResponse, LoginRequest, LoginResponse } from './types'

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns JWT Token
 */
export async function login(username: string, password: string): Promise<string> {
  try {
    // 构造完整的UserBO请求体，匹配后端期望的格式
    const userBO = {
      username,
      password,
      // 其他字段可以为null或默认值，后端只会使用username和password
      id: null,
      email: null,
      roleId: null,
      role: null,
      status: null,
      lastLogin: null,
      createDate: null,
      updateDate: null,
      createdBy: null,
      updatedBy: null
    }

    const response = await api.post<ApiResponse<string>>('/dfm/user/login', userBO)
    const result = response.data
    
    if (result.success && result.data) {
      // 保存token到localStorage
      localStorage.setItem('auth_token', result.data)
      return result.data
    } else {
      throw new Error(result.message || '登录失败')
    }
  } catch (error: any) {
    // 处理具体的错误信息
    if (error.code === 20004) {
      throw new Error('用户不存在')
    } else if (error.code === 20002) {
      throw new Error('账号不存在或密码错误')
    } else if (error.message) {
      throw new Error(error.message)
    } else {
      throw new Error('登录失败，请稍后重试')
    }
  }
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token')
  // 如果需要调用后端登出接口，可以在这里添加
  // await api.post('/user/logout')
}

/**
 * 获取当前登录用户信息
 * @param username 用户名
 */
export async function getUserInfo(username: string): Promise<ApiResponse<any>> {
  return api.get(`/dfm/user/info/${username}`)
}

/**
 * 检查token是否有效
 */
export function isTokenValid(): boolean {
  const token = localStorage.getItem('auth_token')
  if (!token) return false
  
  try {
    // 简单的JWT token解析（不验证签名，仅检查格式和过期时间）
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Date.now() / 1000
    
    return payload.exp > now
  } catch {
    return false
  }
}

/**
 * 获取当前token
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token')
} 