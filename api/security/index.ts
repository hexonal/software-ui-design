import { api } from '@/lib/api/client'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { User, Role, AccessPolicy } from '@/lib/types'

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: "user-001"
 *                 username: "admin"
 *                 email: "admin@example.com"
 *                 role: "管理员"
 *                 status: "活跃"
 *                 lastLogin: "2023-05-10 08:45:12"
 *               - id: "user-002"
 *                 username: "operator"
 *                 email: "operator@example.com"
 *                 role: "操作员"
 *                 status: "活跃"
 *                 lastLogin: "2023-05-09 16:30:45"
 *               - id: "user-003"
 *                 username: "analyst"
 *                 email: "analyst@example.com"
 *                 role: "分析师"
 *                 status: "活跃"
 *                 lastLogin: "2023-05-08 14:15:30"
 *               - id: "user-004"
 *                 username: "guest"
 *                 email: "guest@example.com"
 *                 role: "访客"
 *                 status: "锁定"
 *                 lastLogin: "2023-04-25 10:20:15"
 */
export const getUsers = async (params?: QueryParams): Promise<ApiResponse<User[]>> => {
  return api.get('/dfm/security/users', { params })
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "user-001"
 *               username: "admin"
 *               email: "admin@example.com"
 *               role: "管理员"
 *               status: "活跃"
 *               lastLogin: "2023-05-10 08:45:12"
 */
export const getUserById = async (id: string): Promise<ApiResponse<User | null>> => {
  return api.get(`/dfm/security/users/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "user-001"
 *               username: "admin"
 *               email: "admin@example.com"
 *               role: "管理员"
 *               status: "活跃"
 *               lastLogin: "2023-05-10 08:45:12"
 */
export const createUser = async (data: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
  return api.post('/dfm/security/users', data)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "user-001"
 *               username: "admin"
 *               email: "admin@example.com"
 *               role: "管理员"
 *               status: "活跃"
 *               lastLogin: "2023-05-10 08:45:12"
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<ApiResponse<User | null>> => {
  return api.put(`/dfm/security/users/${id}`, data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *               example:
 *                 success: true
 */
export const deleteUser = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/security/users/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *             example:
 *               - id: "role-001"
 *                 name: "管理员"
 *                 description: "系统管理员，拥有所有权限"
 *                 users: 1
 *                 permissions: "所有权限"
 *               - id: "role-002"
 *                 name: "操作员"
 *                 description: "系统操作员，可以执行大部分操作"
 *                 users: 1
 *                 permissions: "读写权限，无管理权限"
 *               - id: "role-003"
 *                 name: "分析师"
 *                 description: "数据分析师，主要进行数据查询和分析"
 *                 users: 1
 *                 permissions: "只读权限，可执行查询"
 *               - id: "role-004"
 *                 name: "访客"
 *                 description: "系统访客，只能查看有限信息"
 *                 users: 1
 *                 permissions: "有限的只读权限"
 */
export const getRoles = async (params?: QueryParams): Promise<ApiResponse<Role[]>> => {
  return api.get('/dfm/security/roles', { params })
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *             example:
 *               id: "role-001"
 *               name: "管理员"
 *               description: "系统管理员，拥有所有权限"
 *               users: 1
 *               permissions: "所有权限"
 */
export const getRoleById = async (id: string): Promise<ApiResponse<Role | null>> => {
  return api.get(`/dfm/security/roles/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *             example:
 *               id: "role-001"
 *               name: "管理员"
 *               description: "系统管理员，拥有所有权限"
 *               users: 1
 *               permissions: "所有权限"
 */
export const createRole = async (data: Omit<Role, 'id'>): Promise<ApiResponse<Role>> => {
  return api.post('/dfm/security/roles', data)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *             example:
 *               id: "role-001"
 *               name: "管理员"
 *               description: "系统管理员，拥有所有权限"
 *               users: 1
 *               permissions: "所有权限"
 */
export const updateRole = async (id: string, data: Partial<Role>): Promise<ApiResponse<Role | null>> => {
  return api.put(`/dfm/security/roles/${id}`, data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *               example:
 *                 success: true
 */
export const deleteRole = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/security/roles/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AccessPolicy'
 *             example:
 *               - id: "policy-001"
 *                 name: "数据库完全访问"
 *                 type: "数据库"
 *                 target: "postgres-main"
 *                 role: "管理员"
 *                 access: "完全访问"
 *               - id: "policy-002"
 *                 name: "数据库只读访问"
 *                 type: "数据库"
 *                 target: "postgres-main"
 *                 role: "分析师"
 *                 access: "只读"
 *               - id: "policy-003"
 *                 name: "存储管理访问"
 *                 type: "存储"
 *                 target: "文件存储"
 *                 role: "操作员"
 *                 access: "读写"
 *               - id: "policy-004"
 *                 name: "系统监控访问"
 *                 type: "系统"
 *                 target: "监控面板"
 *                 role: "操作员"
 *                 access: "只读"
 */
export const getAccessPolicies = async (params?: QueryParams): Promise<ApiResponse<AccessPolicy[]>> => {
  return api.get('/dfm/security/access-policies', { params })
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessPolicy'
 *             example:
 *               id: "policy-001"
 *               name: "数据库完全访问"
 *               type: "数据库"
 *               target: "postgres-main"
 *               role: "管理员"
 *               access: "完全访问"
 */
export const getAccessPolicyById = async (id: string): Promise<ApiResponse<AccessPolicy | null>> => {
  return api.get(`/dfm/security/access-policies/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessPolicy'
 *             example:
 *               id: "policy-001"
 *               name: "数据库完全访问"
 *               type: "数据库"
 *               target: "postgres-main"
 *               role: "管理员"
 *               access: "完全访问"
 */
export const createAccessPolicy = async (data: Omit<AccessPolicy, 'id'>): Promise<ApiResponse<AccessPolicy>> => {
  return api.post('/dfm/security/access-policies', data)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessPolicy'
 *             example:
 *               id: "policy-001"
 *               name: "数据库完全访问"
 *               type: "数据库"
 *               target: "postgres-main"
 *               role: "管理员"
 *               access: "完全访问"
 */
export const updateAccessPolicy = async (id: string, data: Partial<AccessPolicy>): Promise<ApiResponse<AccessPolicy | null>> => {
  return api.put(`/dfm/security/access-policies/${id}`, data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *               example:
 *                 success: true
 */
export const deleteAccessPolicy = async (id: string): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/security/access-policies/${id}`)
}

// =============================================== 权限管理 API
// ===============================================

/**
 * 权限分组接口
 */
export interface PermissionGroup {
  id: string
  name: string
  description?: string
  permissions: Permission[]
}

/**
 * 权限接口
 */
export interface Permission {
  id: string
  name: string
  code: string
  description?: string
  groupId: string
}

/**
 * 角色权限接口
 */
export interface RolePermissions {
  roleId: string
  roleName: string
  grantedPermissions: string[]
}

/**
 * 更新角色权限请求接口
 */
export interface UpdateRolePermissionsRequest {
  permissionIds: string[]
  remark?: string
}

/**
 * 权限检查结果接口
 */
export interface PermissionCheckResult {
  roleId: string
  permissionCode: string
  hasPermission: boolean
}

/**
 * @openapi
 * /security/permissions/groups:
 *   get:
 *     summary: 获取权限分组列表
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: 权限分组列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionGroup'
 *             example:
 *               - id: "database"
 *                 name: "数据库管理权限"
 *                 description: "数据库管理权限相关的所有权限"
 *                 permissions:
 *                   - id: "db_view"
 *                     name: "查看数据库"
 *                     code: "database:view"
 *                     description: "查看数据库的权限"
 *                     groupId: "database"
 *                   - id: "db_create"
 *                     name: "创建数据库"
 *                     code: "database:create"
 *                     description: "创建数据库的权限"
 *                     groupId: "database"
 */
export const getPermissionGroups = async (): Promise<ApiResponse<PermissionGroup[]>> => {
  return api.get('/dfm/security/permissions/groups')
}

/**
 * @openapi
 * /security/permissions:
 *   get:
 *     summary: 获取所有权限列表
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: 权限列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 */
export const getAllPermissions = async (): Promise<ApiResponse<Permission[]>> => {
  return api.get('/dfm/security/permissions')
}

/**
 * @openapi
 * /security/roles/{roleId}/permissions:
 *   get:
 *     summary: 获取角色权限
 *     tags:
 *       - Permissions
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 角色权限配置
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermissions'
 *             example:
 *               roleId: "1"
 *               roleName: "管理员"
 *               grantedPermissions: ["db_view", "db_create", "storage_view"]
 */
export const getRolePermissions = async (roleId: string): Promise<ApiResponse<RolePermissions>> => {
  return api.get(`/dfm/security/roles/${roleId}/permissions`)
}

/**
 * @openapi
 * /security/roles/{roleId}/permissions:
 *   put:
 *     summary: 更新角色权限
 *     tags:
 *       - Permissions
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRolePermissionsRequest'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermissions'
 */
export const updateRolePermissions = async (
  roleId: string,
  data: UpdateRolePermissionsRequest
): Promise<ApiResponse<RolePermissions>> => {
  return api.put(`/dfm/security/roles/${roleId}/permissions`, data)
}

/**
 * @openapi
 * /security/roles/{roleId}/permissions/check:
 *   get:
 *     summary: 检查角色权限
 *     tags:
 *       - Permissions
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: permissionCode
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 权限检查结果
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionCheckResult'
 */
export const checkRolePermission = async (
  roleId: string,
  permissionCode: string
): Promise<ApiResponse<PermissionCheckResult>> => {
  return api.get(`/dfm/security/roles/${roleId}/permissions/check`, {
    params: { permissionCode }
  })
}