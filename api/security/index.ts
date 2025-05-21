import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { User, Role, AccessPolicy } from '@/mock/dashboard/types'

/**
 * @openapi
 * /security/users:
 *   get:
 *     summary: 获取用户列表
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: 用户列表
 */
export const getUsers = async (params?: QueryParams): Promise<ApiResponse<User[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('users') as User[])
  }
  
  return api.get('/security/users', { params })
}

/**
 * @openapi
 * /security/users/{id}:
 *   get:
 *     summary: 获取用户详情
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 用户详情
 */
export const getUserById = async (id: string): Promise<ApiResponse<User | null>> => {
  if (useMock()) {
    const users = getMockData('users') as User[]
    const user = users.find(u => u.id === id)
    
    if (!user) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(user)
  }
  
  return api.get(`/security/users/${id}`)
}

/**
 * @openapi
 * /security/users:
 *   post:
 *     summary: 创建用户
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createUser = async (data: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
  if (useMock()) {
    // 模拟创建用户
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data
    }
    return mockResponse(newUser)
  }
  
  return api.post('/security/users', data)
}

/**
 * @openapi
 * /security/users/{id}:
 *   put:
 *     summary: 更新用户
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<ApiResponse<User | null>> => {
  if (useMock()) {
    const users = getMockData('users') as User[]
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedUser = { ...users[userIndex], ...data }
    return mockResponse(updatedUser)
  }
  
  return api.put(`/security/users/${id}`, data)
}

/**
 * @openapi
 * /security/users/{id}:
 *   delete:
 *     summary: 删除用户
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteUser = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/security/users/${id}`)
}

/**
 * @openapi
 * /security/roles:
 *   get:
 *     summary: 获取角色列表
 *     tags:
 *       - Role
 *     responses:
 *       200:
 *         description: 角色列表
 */
export const getRoles = async (params?: QueryParams): Promise<ApiResponse<Role[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('roles') as Role[])
  }
  
  return api.get('/security/roles', { params })
}

/**
 * @openapi
 * /security/roles/{id}:
 *   get:
 *     summary: 获取角色详情
 *     tags:
 *       - Role
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 角色详情
 */
export const getRoleById = async (id: string): Promise<ApiResponse<Role | null>> => {
  if (useMock()) {
    const roles = getMockData('roles') as Role[]
    const role = roles.find(r => r.id === id)
    
    if (!role) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(role)
  }
  
  return api.get(`/security/roles/${id}`)
}

/**
 * @openapi
 * /security/roles:
 *   post:
 *     summary: 创建角色
 *     tags:
 *       - Role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createRole = async (data: Omit<Role, 'id'>): Promise<ApiResponse<Role>> => {
  if (useMock()) {
    // 模拟创建角色
    const newRole: Role = {
      id: `role-${Date.now()}`,
      ...data
    }
    return mockResponse(newRole)
  }
  
  return api.post('/security/roles', data)
}

/**
 * @openapi
 * /security/roles/{id}:
 *   put:
 *     summary: 更新角色
 *     tags:
 *       - Role
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateRole = async (id: string, data: Partial<Role>): Promise<ApiResponse<Role | null>> => {
  if (useMock()) {
    const roles = getMockData('roles') as Role[]
    const roleIndex = roles.findIndex(r => r.id === id)
    
    if (roleIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedRole = { ...roles[roleIndex], ...data }
    return mockResponse(updatedRole)
  }
  
  return api.put(`/security/roles/${id}`, data)
}

/**
 * @openapi
 * /security/roles/{id}:
 *   delete:
 *     summary: 删除角色
 *     tags:
 *       - Role
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteRole = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/security/roles/${id}`)
}

/**
 * @openapi
 * /security/access-policies:
 *   get:
 *     summary: 获取访问策略列表
 *     tags:
 *       - AccessPolicy
 *     responses:
 *       200:
 *         description: 访问策略列表
 */
export const getAccessPolicies = async (params?: QueryParams): Promise<ApiResponse<AccessPolicy[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('accessPolicies') as AccessPolicy[])
  }
  
  return api.get('/security/access-policies', { params })
}

/**
 * @openapi
 * /security/access-policies/{id}:
 *   get:
 *     summary: 获取访问策略详情
 *     tags:
 *       - AccessPolicy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 访问策略详情
 */
export const getAccessPolicyById = async (id: string): Promise<ApiResponse<AccessPolicy | null>> => {
  if (useMock()) {
    const policies = getMockData('accessPolicies') as AccessPolicy[]
    const policy = policies.find(p => p.id === id)
    
    if (!policy) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(policy)
  }
  
  return api.get(`/security/access-policies/${id}`)
}

/**
 * @openapi
 * /security/access-policies:
 *   post:
 *     summary: 创建访问策略
 *     tags:
 *       - AccessPolicy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessPolicy'
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createAccessPolicy = async (data: Omit<AccessPolicy, 'id'>): Promise<ApiResponse<AccessPolicy>> => {
  if (useMock()) {
    // 模拟创建访问策略
    const newPolicy: AccessPolicy = {
      id: `policy-${Date.now()}`,
      ...data
    }
    return mockResponse(newPolicy)
  }
  
  return api.post('/security/access-policies', data)
}

/**
 * @openapi
 * /security/access-policies/{id}:
 *   put:
 *     summary: 更新访问策略
 *     tags:
 *       - AccessPolicy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessPolicy'
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateAccessPolicy = async (id: string, data: Partial<AccessPolicy>): Promise<ApiResponse<AccessPolicy | null>> => {
  if (useMock()) {
    const policies = getMockData('accessPolicies') as AccessPolicy[]
    const policyIndex = policies.findIndex(p => p.id === id)
    
    if (policyIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedPolicy = { ...policies[policyIndex], ...data }
    return mockResponse(updatedPolicy)
  }
  
  return api.put(`/security/access-policies/${id}`, data)
}

/**
 * @openapi
 * /security/access-policies/{id}:
 *   delete:
 *     summary: 删除访问策略
 *     tags:
 *       - AccessPolicy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteAccessPolicy = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/security/access-policies/${id}`)
}