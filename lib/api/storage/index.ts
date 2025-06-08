import { api } from '@/lib/api/client'

// ===========================
// 类型定义 (基于后端DTO)
// ===========================

/**
 * 卷类型定义 (对应VolumeDto)
 */
export interface Volume {
    id: string
    dataCenter: string
    collection: string
    size: number
    fileCount: number
    activeFileCount: number
    deletedFileCount: number
    readOnly: boolean
    replicaPlacement: string
    ttl: string
    version: number
}

/**
 * 快照类型定义 (对应SnapshotDto)
 */
export interface Snapshot {
    id: string
    name: string
    volumeId: string
    size: number
    status: string
    createdAt: Date
    description: string
    type: string
}

/**
 * 文件信息类型定义 (对应FileInfoDto)
 */
export interface FileInfo {
    name: string
    path: string
    size: number
    type: string
    modifiedTime: Date
    isDirectory: boolean
    permissions: string
    owner: string
}

/**
 * 文件上传响应类型 (对应FileUploadResponseBO)
 */
export interface FileUploadResponse {
    success: boolean
    fileName: string
    fid: string
    size: number
    message?: string
}

/**
 * 存储桶类型定义 (对应StorageBucketBO)
 */
export interface StorageBucket {
    id: string
    name: string
    region: string
    access: "public" | "private"
    objectCount: number
    size: number
    createdAt: string
}

/**
 * 存储对象类型定义 (对应StorageObjectBO)
 */
export interface StorageObject {
    key: string
    bucketName: string
    size: number
    type: string
    lastModified: string
    access: "public" | "private"
}

/**
 * 生命周期策略类型定义 (对应LifecyclePolicyBO)
 */
export interface LifecyclePolicy {
    id: string
    name: string
    description: string
    bucketName: string
    prefix: string
    action: "transition" | "expiration"
    targetStorageClass?: string
    days: number
    enabled: boolean
    createdAt: string
}

/**
 * 创建生命周期策略请求类型 (对应CreateLifecyclePolicyRequest)
 */
export interface CreateLifecyclePolicyRequest {
    name: string
    description: string
    bucketName: string
    prefix: string
    action: "transition" | "expiration"
    targetStorageClass?: string
    days: number
    enabled: boolean
}

// ===========================
// 通用API响应类型
// ===========================
interface ApiResponse<T> {
    success: boolean
    data: T
    message: string
}

// ===========================
// 卷管理相关API (实际后端接口)
// ===========================

/**
 * 获取所有卷
 * GET /dfm/storage/volumes
 */
export async function getVolumes(page?: number, size?: number, search?: string): Promise<ApiResponse<Volume[]>> {
    try {
        const params = new URLSearchParams()
        if (page !== undefined) params.append('page', page.toString())
        if (size !== undefined) params.append('size', size.toString())
        if (search) params.append('search', search)

        const response = await api.get(`/dfm/storage/volumes?${params.toString()}`)
        return {
            success: true,
            data: response.data,
            message: '获取卷列表成功'
        }
    } catch (error) {
        console.error('获取卷列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取卷列表失败'
        }
    }
}

/**
 * 获取卷详情
 * GET /dfm/storage/volumes/{id}
 */
export async function getVolumeById(id: string): Promise<ApiResponse<Volume | null>> {
    try {
        const response = await api.get(`/dfm/storage/volumes/${id}`)
        return {
            success: true,
            data: response.data,
            message: '获取卷详情成功'
        }
    } catch (error) {
        console.error('获取卷详情失败:', error)
        return {
            success: false,
            data: null,
            message: '获取卷详情失败'
        }
    }
}

/**
 * 创建卷
 * POST /dfm/storage/volumes
 */
export async function createVolume(volumeData: Partial<Volume>): Promise<ApiResponse<Volume | null>> {
    try {
        const response = await api.post('/dfm/storage/volumes', volumeData)
        return {
            success: true,
            data: response.data,
            message: '创建卷成功'
        }
    } catch (error) {
        console.error('创建卷失败:', error)
        return {
            success: false,
            data: null,
            message: '创建卷失败'
        }
    }
}

/**
 * 更新卷
 * PUT /dfm/storage/volumes/{id}
 */
export async function updateVolume(id: string, volumeData: Partial<Volume>): Promise<ApiResponse<Volume | null>> {
    try {
        const response = await api.put(`/dfm/storage/volumes/${id}`, volumeData)
        return {
            success: true,
            data: response.data,
            message: '更新卷成功'
        }
    } catch (error) {
        console.error('更新卷失败:', error)
        return {
            success: false,
            data: null,
            message: '更新卷失败'
        }
    }
}

/**
 * 删除卷
 * DELETE /dfm/storage/volumes/{id}
 */
export async function deleteVolume(id: string): Promise<ApiResponse<boolean>> {
    try {
        const response = await api.delete(`/dfm/storage/volumes/${id}`)
        return {
            success: response.data === true,
            data: response.data,
            message: response.data ? '删除卷成功' : '删除卷失败'
        }
    } catch (error) {
        console.error('删除卷失败:', error)
        return {
            success: false,
            data: false,
            message: '删除卷失败'
        }
    }
}

// ===========================
// 快照管理相关API
// ===========================

/**
 * 获取所有快照
 * GET /dfm/storage/snapshots
 */
export async function getSnapshots(page?: number, size?: number, search?: string): Promise<ApiResponse<Snapshot[]>> {
    try {
        const params = new URLSearchParams()
        if (page !== undefined) params.append('page', page.toString())
        if (size !== undefined) params.append('size', size.toString())
        if (search) params.append('search', search)

        const response = await api.get(`/dfm/storage/snapshots?${params.toString()}`)
        return {
            success: true,
            data: response.data,
            message: '获取快照列表成功'
        }
    } catch (error) {
        console.error('获取快照列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取快照列表失败'
        }
    }
}

/**
 * 获取快照详情
 * GET /dfm/storage/snapshots/{id}
 */
export async function getSnapshotById(id: string): Promise<ApiResponse<Snapshot | null>> {
    try {
        const response = await api.get(`/dfm/storage/snapshots/${id}`)
        return {
            success: true,
            data: response.data,
            message: '获取快照详情成功'
        }
    } catch (error) {
        console.error('获取快照详情失败:', error)
        return {
            success: false,
            data: null,
            message: '获取快照详情失败'
        }
    }
}

/**
 * 创建快照
 * POST /dfm/storage/snapshots
 */
export async function createSnapshot(snapshotData: Partial<Snapshot>): Promise<ApiResponse<Snapshot | null>> {
    try {
        const response = await api.post('/dfm/storage/snapshots', snapshotData)
        return {
            success: true,
            data: response.data,
            message: '创建快照成功'
        }
    } catch (error) {
        console.error('创建快照失败:', error)
        return {
            success: false,
            data: null,
            message: '创建快照失败'
        }
    }
}

/**
 * 删除快照
 * DELETE /dfm/storage/snapshots/{id}
 */
export async function deleteSnapshot(id: string): Promise<ApiResponse<boolean>> {
    try {
        const response = await api.delete(`/dfm/storage/snapshots/${id}`)
        return {
            success: response.data === true,
            data: response.data,
            message: response.data ? '删除快照成功' : '删除快照失败'
        }
    } catch (error) {
        console.error('删除快照失败:', error)
        return {
            success: false,
            data: false,
            message: '删除快照失败'
        }
    }
}

// ===========================
// 文件管理相关API
// ===========================

/**
 * 获取文件列表
 * GET /dfm/storage/files
 */
export async function getFiles(path: string = '/'): Promise<ApiResponse<FileInfo[]>> {
    try {
        const params = new URLSearchParams()
        params.append('path', path)

        const response = await api.get(`/dfm/storage/files?${params.toString()}`)
        return {
            success: true,
            data: response.data,
            message: '获取文件列表成功'
        }
    } catch (error) {
        console.error('获取文件列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取文件列表失败'
        }
    }
}

/**
 * 上传文件
 * POST /dfm/storage/files/upload
 */
export async function uploadFile(path: string, file: File): Promise<ApiResponse<FileUploadResponse | null>> {
    try {
        const formData = new FormData()
        formData.append('path', path)
        formData.append('file', file)

        const response = await api.post('/dfm/storage/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return {
            success: true,
            data: response.data,
            message: '文件上传成功'
        }
    } catch (error) {
        console.error('文件上传失败:', error)
        return {
            success: false,
            data: null,
            message: '文件上传失败'
        }
    }
}

/**
 * 删除文件
 * DELETE /dfm/storage/files
 */
export async function deleteFile(path: string): Promise<ApiResponse<boolean>> {
    try {
        const params = new URLSearchParams()
        params.append('path', path)

        const response = await api.delete(`/dfm/storage/files?${params.toString()}`)
        return {
            success: response.data === true,
            data: response.data,
            message: response.data ? '删除文件成功' : '删除文件失败'
        }
    } catch (error) {
        console.error('删除文件失败:', error)
        return {
            success: false,
            data: false,
            message: '删除文件失败'
        }
    }
}

// ===========================
// 对象存储相关API
// ===========================

/**
 * 生成对象访问链接
 * POST /dfm/storage/objects/generate-url
 */
export async function generateObjectUrl(bucketName: string, key: string, expiresIn?: number, access?: 'public' | 'private'): Promise<ApiResponse<any>> {
    try {
        const requestData = {
            bucketName,
            key,
            expiresIn: expiresIn || 3600,
            access: access || 'private'
        }

        const response = await api.post('/dfm/storage/objects/generate-url', requestData)
        return {
            success: true,
            data: response.data,
            message: '生成访问链接成功'
        }
    } catch (error) {
        console.error('生成访问链接失败:', error)
        return {
            success: false,
            data: null,
            message: '生成访问链接失败'
        }
    }
}

// ===========================
// 存储概览相关API
// ===========================

/**
 * 获取存储概览统计信息
 * POST /dfm/storage/overview/stats
 */
export async function getStorageOverviewStats(): Promise<ApiResponse<any>> {
    try {
        const response = await api.post('/dfm/storage/overview/stats', {})
        return {
            success: true,
            data: response.data,
            message: '获取存储统计成功'
        }
    } catch (error) {
        console.error('获取存储统计失败:', error)
        return {
            success: false,
            data: null,
            message: '获取存储统计失败'
        }
    }
}

/**
 * 获取存储类型分布数据
 * POST /dfm/storage/overview/types
 */
export async function getStorageTypesDistribution(): Promise<ApiResponse<any[]>> {
    try {
        const response = await api.post('/dfm/storage/overview/types', {})
        return {
            success: true,
            data: response.data,
            message: '获取存储类型分布成功'
        }
    } catch (error) {
        console.error('获取存储类型分布失败:', error)
        return {
            success: false,
            data: [],
            message: '获取存储类型分布失败'
        }
    }
}

/**
 * 获取存储节点状态列表
 * POST /dfm/storage/overview/nodes
 */
export async function getStorageNodes(): Promise<ApiResponse<any[]>> {
    try {
        const response = await api.post('/dfm/storage/overview/nodes', {})
        return {
            success: true,
            data: response.data,
            message: '获取存储节点列表成功'
        }
    } catch (error) {
        console.error('获取存储节点列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取存储节点列表失败'
        }
    }
}

/**
 * 获取存储性能数据
 * POST /dfm/storage/overview/performance
 */
export async function getStoragePerformanceData(): Promise<ApiResponse<any[]>> {
    try {
        const response = await api.post('/dfm/storage/overview/performance', {})
        return {
            success: true,
            data: response.data,
            message: '获取存储性能数据成功'
        }
    } catch (error) {
        console.error('获取存储性能数据失败:', error)
        return {
            success: false,
            data: [],
            message: '获取存储性能数据失败'
        }
    }
}

// ===========================
// 生命周期策略相关API
// ===========================

/**
 * 获取生命周期策略列表
 * POST /dfm/storage/lifecycle/list
 */
export async function getLifecyclePolicies(): Promise<ApiResponse<any[]>> {
    try {
        const response = await api.post('/dfm/storage/lifecycle/list', {})
        return {
            success: true,
            data: response.data,
            message: '获取生命周期策略列表成功'
        }
    } catch (error) {
        console.error('获取生命周期策略列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取生命周期策略列表失败'
        }
    }
}

/**
 * 创建生命周期策略
 * POST /dfm/storage/lifecycle/create
 */
export async function createLifecyclePolicy(request: CreateLifecyclePolicyRequest): Promise<ApiResponse<any>> {
    try {
        const response = await api.post('/dfm/storage/lifecycle/create', request)
        return {
            success: true,
            data: response.data,
            message: '创建生命周期策略成功'
        }
    } catch (error) {
        console.error('创建生命周期策略失败:', error)
        return {
            success: false,
            data: null,
            message: '创建生命周期策略失败'
        }
    }
}

/**
 * 更新生命周期策略
 * POST /dfm/storage/lifecycle/update
 */
export async function updateLifecyclePolicy(id: string, updates: Partial<LifecyclePolicy>): Promise<ApiResponse<any>> {
    try {
        const requestData = { id, ...updates }
        const response = await api.post('/dfm/storage/lifecycle/update', requestData)
        return {
            success: true,
            data: response.data,
            message: '更新生命周期策略成功'
        }
    } catch (error) {
        console.error('更新生命周期策略失败:', error)
        return {
            success: false,
            data: null,
            message: '更新生命周期策略失败'
        }
    }
}

/**
 * 删除生命周期策略
 * POST /dfm/storage/lifecycle/delete
 */
export async function deleteLifecyclePolicy(id: string): Promise<ApiResponse<any>> {
    try {
        const response = await api.post('/dfm/storage/lifecycle/delete', { id })
        return {
            success: true,
            data: response.data,
            message: '删除生命周期策略成功'
        }
    } catch (error) {
        console.error('删除生命周期策略失败:', error)
        return {
            success: false,
            data: null,
            message: '删除生命周期策略失败'
        }
    }
}

/**
 * 启用/禁用生命周期策略
 * POST /dfm/storage/lifecycle/toggle
 */
export async function toggleLifecyclePolicy(id: string, enabled: boolean): Promise<ApiResponse<any>> {
    try {
        const response = await api.post('/dfm/storage/lifecycle/toggle', { id, enabled })
        return {
            success: true,
            data: response.data,
            message: `${enabled ? '启用' : '禁用'}生命周期策略成功`
        }
    } catch (error) {
        console.error('切换生命周期策略状态失败:', error)
        return {
            success: false,
            data: null,
            message: '切换生命周期策略状态失败'
        }
    }
}

