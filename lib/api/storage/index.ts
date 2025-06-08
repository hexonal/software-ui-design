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
        let url = '/dfm/storage/files'

        // 只有当path不是根目录时才添加path参数
        if (path && path !== '/') {
            const params = new URLSearchParams()
            params.append('path', path)
            url += `?${params.toString()}`
        }

        console.log('请求文件列表URL:', url)
        const response = await api.get(url)
        console.log('原始API响应:', response.data)

        // 这里response.data已经经过了响应拦截器处理，包含success字段
        const result = response.data as ApiResponse<FileInfo[]>

        // 确保返回的格式正确
        if (result.success === true) {
            console.log('API调用成功，文件数量:', Array.isArray(result.data) ? result.data.length : 0)
            return {
                success: true,
                message: result.message || '获取文件列表成功',
                data: Array.isArray(result.data) ? result.data : []
            }
        } else {
            console.log('API调用失败:', result.message)
            return {
                success: false,
                message: result.message || '获取文件列表失败',
                data: []
            }
        }
    } catch (error: any) {
        console.error('获取文件列表异常:', error)

        // 处理axios异常，通常error.response.data已经是处理过的ApiResponse
        if (error.response?.data) {
            const errorData = error.response.data as ApiResponse<FileInfo[]>
            return {
                success: false,
                message: errorData.message || '获取文件列表失败',
                data: []
            }
        }

        return {
            success: false,
            message: error.message || '网络错误，无法获取文件列表',
            data: []
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

        console.log('上传文件请求:', { path, fileName: file.name, fileSize: file.size })
        const response = await api.post('/dfm/storage/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log('文件上传API响应:', response.data)

        // 这里response.data已经经过了响应拦截器处理，包含success字段
        const result = response.data as ApiResponse<FileUploadResponse>

        if (result.success === true) {
            console.log('文件上传成功:', result.message)
            return {
                success: true,
                message: result.message || '文件上传成功',
                data: result.data
            }
        } else {
            console.log('文件上传失败:', result.message)
            return {
                success: false,
                message: result.message || '文件上传失败',
                data: null
            }
        }
    } catch (error: any) {
        console.error('文件上传异常:', error)

        // 处理axios异常，通常error.response.data已经是处理过的ApiResponse
        if (error.response?.data) {
            const errorData = error.response.data as ApiResponse<FileUploadResponse>
            return {
                success: false,
                message: errorData.message || '文件上传失败',
                data: null
            }
        }

        return {
            success: false,
            message: error.message || '网络错误，文件上传失败',
            data: null
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

        console.log('删除文件请求:', { path })
        const response = await api.delete(`/dfm/storage/files?${params.toString()}`)
        console.log('文件删除API响应:', response.data)

        // 这里response.data已经经过了响应拦截器处理，包含success字段
        const result = response.data as ApiResponse<boolean>

        if (result.success === true) {
            console.log('文件删除成功:', result.message)
            return {
                success: true,
                message: result.message || '删除文件成功',
                data: true
            }
        } else {
            console.log('文件删除失败:', result.message)
            return {
                success: false,
                message: result.message || '删除文件失败',
                data: false
            }
        }
    } catch (error: any) {
        console.error('文件删除异常:', error)

        // 处理axios异常，通常error.response.data已经是处理过的ApiResponse
        if (error.response?.data) {
            const errorData = error.response.data as ApiResponse<boolean>
            return {
                success: false,
                message: errorData.message || '删除文件失败',
                data: false
            }
        }

        return {
            success: false,
            message: error.message || '网络错误，删除文件失败',
            data: false
        }
    }
}

// ===========================
// 对象存储相关API
// ===========================

/**
 * 获取所有存储桶
 * GET /dfm/storage/buckets
 */
export async function getBuckets(page?: number, size?: number, search?: string): Promise<ApiResponse<StorageBucket[]>> {
    try {
        const params = new URLSearchParams()
        if (page !== undefined) params.append('page', page.toString())
        if (size !== undefined) params.append('size', size.toString())
        if (search) params.append('search', search)

        const response = await api.get(`/dfm/storage/buckets?${params.toString()}`)
        return {
            success: true,
            data: response.data,
            message: '获取存储桶列表成功'
        }
    } catch (error) {
        console.error('获取存储桶列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取存储桶列表失败'
        }
    }
}

/**
 * 获取存储桶详情
 * GET /dfm/storage/buckets/{name}
 */
export async function getBucketByName(name: string): Promise<ApiResponse<StorageBucket | null>> {
    try {
        const response = await api.get(`/dfm/storage/buckets/${name}`)
        return {
            success: true,
            data: response.data,
            message: '获取存储桶详情成功'
        }
    } catch (error) {
        console.error('获取存储桶详情失败:', error)
        return {
            success: false,
            data: null,
            message: '获取存储桶详情失败'
        }
    }
}

/**
 * 创建存储桶
 * POST /dfm/storage/buckets
 */
export async function createBucket(bucketData: Partial<StorageBucket>): Promise<ApiResponse<StorageBucket | null>> {
    try {
        const response = await api.post('/dfm/storage/buckets', bucketData)
        return {
            success: true,
            data: response.data,
            message: '创建存储桶成功'
        }
    } catch (error) {
        console.error('创建存储桶失败:', error)
        return {
            success: false,
            data: null,
            message: '创建存储桶失败'
        }
    }
}

/**
 * 更新存储桶
 * PUT /dfm/storage/buckets/{name}
 */
export async function updateBucket(name: string, bucketData: Partial<StorageBucket>): Promise<ApiResponse<StorageBucket | null>> {
    try {
        const response = await api.put(`/dfm/storage/buckets/${name}`, bucketData)
        return {
            success: true,
            data: response.data,
            message: '更新存储桶成功'
        }
    } catch (error) {
        console.error('更新存储桶失败:', error)
        return {
            success: false,
            data: null,
            message: '更新存储桶失败'
        }
    }
}

/**
 * 删除存储桶
 * DELETE /dfm/storage/buckets/{name}
 */
export async function deleteBucket(name: string): Promise<ApiResponse<boolean>> {
    try {
        const response = await api.delete(`/dfm/storage/buckets/${name}`)
        return {
            success: response.data === true,
            data: response.data,
            message: response.data ? '删除存储桶成功' : '删除存储桶失败'
        }
    } catch (error) {
        console.error('删除存储桶失败:', error)
        return {
            success: false,
            data: false,
            message: '删除存储桶失败'
        }
    }
}

/**
 * 获取存储桶中的对象列表
 * GET /dfm/storage/buckets/{bucketName}/objects
 */
export async function getBucketObjects(bucketName: string, prefix?: string, page?: number, size?: number): Promise<ApiResponse<StorageObject[]>> {
    try {
        const params = new URLSearchParams()
        if (prefix) params.append('prefix', prefix)
        if (page !== undefined) params.append('page', page.toString())
        if (size !== undefined) params.append('size', size.toString())

        const response = await api.get(`/dfm/storage/buckets/${bucketName}/objects?${params.toString()}`)
        return {
            success: true,
            data: response.data,
            message: '获取对象列表成功'
        }
    } catch (error) {
        console.error('获取对象列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取对象列表失败'
        }
    }
}

/**
 * 上传对象到存储桶
 * POST /dfm/storage/buckets/{bucketName}/objects
 */
export async function uploadObject(bucketName: string, key: string, file: File, access?: 'public' | 'private'): Promise<ApiResponse<StorageObject | null>> {
    try {
        const formData = new FormData()
        formData.append('key', key)
        formData.append('file', file)
        if (access) formData.append('access', access)

        const response = await api.post(`/dfm/storage/buckets/${bucketName}/objects`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return {
            success: true,
            data: response.data,
            message: '上传对象成功'
        }
    } catch (error) {
        console.error('上传对象失败:', error)
        return {
            success: false,
            data: null,
            message: '上传对象失败'
        }
    }
}

/**
 * 删除存储桶中的对象
 * DELETE /dfm/storage/buckets/{bucketName}/objects/{key}
 */
export async function deleteObject(bucketName: string, key: string): Promise<ApiResponse<boolean>> {
    try {
        const response = await api.delete(`/dfm/storage/buckets/${bucketName}/objects/${encodeURIComponent(key)}`)
        return {
            success: response.data === true,
            data: response.data,
            message: response.data ? '删除对象成功' : '删除对象失败'
        }
    } catch (error) {
        console.error('删除对象失败:', error)
        return {
            success: false,
            data: false,
            message: '删除对象失败'
        }
    }
}

/**
 * 获取所有存储对象（跨存储桶）
 * GET /dfm/storage/objects
 */
export async function getObjects(page?: number, size?: number, search?: string): Promise<ApiResponse<StorageObject[]>> {
    try {
        const params = new URLSearchParams()
        if (page !== undefined) params.append('page', page.toString())
        if (size !== undefined) params.append('size', size.toString())
        if (search) params.append('search', search)

        const response = await api.get(`/dfm/storage/objects?${params.toString()}`)
        return {
            success: true,
            data: response.data,
            message: '获取对象列表成功'
        }
    } catch (error) {
        console.error('获取对象列表失败:', error)
        return {
            success: false,
            data: [],
            message: '获取对象列表失败'
        }
    }
}

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

