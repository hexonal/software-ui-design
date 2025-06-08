// 数据库和系统相关类型定义



export interface Node {
    id: number
    name: string
    ip: string
    port?: string
    username?: string
    password?: string
    role: string
    status: string
    cpu: number
    memory: number
    disk: number
    createDate?: string
    updateDate?: string
    createdBy?: string
    updatedBy?: string
}

export interface Database {
    id: string
    name: string
    charset?: string
    collation?: string
    size: string
    tables?: number
    retention?: string
    series?: number
    points?: string
    status?: string
}

export interface Table {
    name: string
    database: string
    type: string
    fields: number
    rows: string
    size: string
    indexes: number
}

export interface TimeSeries {
    name: string
    tags: Array<{ key: string, value: string }>
    type: string
    points: string
}

export interface RetentionPolicy {
    name: string
    duration: string
    replication: number
    default: boolean
}

export interface BackupHistory {
    id: string
    name: string
    type: string
    status: string
    size: string
    startTime: string
    endTime: string
    duration: string
}

export interface BackupSchedule {
    id: string
    name: string
    type: string
    schedule: string
    target: string
    retention: string
    status: string
    lastRun: string
    nextRun: string
}

export interface User {
    id: string
    username: string
    email: string
    role: string
    status: string
    lastLogin: string
}

export interface Role {
    id: string
    name: string
    description: string
    users: number
    permissions: string
}

export interface AccessPolicy {
    id: string
    name: string
    type: string
    target: string
    role: string
    access: string
}

// =============================================== 权限管理类型
// ===============================================

export interface Permission {
    id: string
    name: string
    code: string
    description?: string
    groupId: string
}

export interface PermissionGroup {
    id: string
    name: string
    description?: string
    permissions: Permission[]
}

export interface RolePermissions {
    roleId: string
    roleName: string
    grantedPermissions: string[]
}

export interface UpdateRolePermissionsRequest {
    permissionIds: string[]
    remark?: string
}

export interface PermissionCheckResult {
    roleId: string
    permissionCode: string
    hasPermission: boolean
} 