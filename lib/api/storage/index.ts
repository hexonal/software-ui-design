import { api } from '@/lib/api/client'

// 存储桶类型定义
export interface StorageBucket {
    id: string
    name: string
    region: string
    access: "public" | "private"
    objectCount: number
    size: number
    createdAt: string
}

// 存储对象类型定义
export interface StorageObject {
    key: string
    bucketName: string
    size: number
    type: string
    lastModified: string
    access: "public" | "private"
}

// 创建存储桶请求类型
export interface CreateBucketRequest {
    name: string
    region: string
    access: "public" | "private"
}

// 上传对象请求类型
export interface UploadObjectRequest {
    bucketName: string
    key: string
    file: File
    access?: "public" | "private"
}

/**
 * 获取存储桶列表
 */
export async function getBuckets() {
    try {
        const response = await api.post('/storage/buckets/list', {})
        return {
            success: true,
            data: response.data.data as StorageBucket[],
            message: response.data.message
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
 * 创建存储桶
 */
export async function createBucket(request: CreateBucketRequest) {
    try {
        const response = await api.post('/storage/buckets/create', request)
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '存储桶创建成功'
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
 * 删除存储桶
 */
export async function deleteBucket(bucketId: string) {
    try {
        const response = await api.post('/storage/buckets/delete', { bucketId })
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '存储桶删除成功'
        }
    } catch (error) {
        console.error('删除存储桶失败:', error)
        return {
            success: false,
            data: null,
            message: '删除存储桶失败'
        }
    }
}

/**
 * 获取对象列表
 */
export async function getObjects(bucketName?: string) {
    try {
        const response = await api.post('/storage/objects/list', { bucketName })
        return {
            success: true,
            data: response.data.data as StorageObject[],
            message: response.data.message
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
 * 上传对象
 */
export async function uploadObject(request: UploadObjectRequest) {
    try {
        const formData = new FormData()
        formData.append('bucketName', request.bucketName)
        formData.append('key', request.key)
        formData.append('file', request.file)
        if (request.access) {
            formData.append('access', request.access)
        }

        const response = await api.post('/storage/objects/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '对象上传成功'
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
 * 删除对象
 */
export async function deleteObject(bucketName: string, key: string) {
    try {
        const response = await api.post('/storage/objects/delete', { bucketName, key })
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '对象删除成功'
        }
    } catch (error) {
        console.error('删除对象失败:', error)
        return {
            success: false,
            data: null,
            message: '删除对象失败'
        }
    }
}

/**
 * 生成对象访问链接
 */
export async function generateObjectUrl(bucketName: string, key: string, expiresIn?: number) {
    try {
        const response = await api.post('/storage/objects/generate-url', {
            bucketName,
            key,
            expiresIn: expiresIn || 3600 // 默认1小时
        })
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '访问链接生成成功'
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

// ==================== 生命周期策略相关 ====================

// 生命周期策略类型定义
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

// 创建生命周期策略请求类型
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

/**
 * 获取生命周期策略列表
 */
export async function getLifecyclePolicies() {
    try {
        const response = await api.post('/storage/lifecycle/list', {})
        return {
            success: true,
            data: response.data.data as LifecyclePolicy[],
            message: response.data.message
        }
    } catch (error) {
        console.error('获取生命周期策略失败:', error)
        return {
            success: false,
            data: [],
            message: '获取生命周期策略失败'
        }
    }
}

/**
 * 创建生命周期策略
 */
export async function createLifecyclePolicy(request: CreateLifecyclePolicyRequest) {
    try {
        const response = await api.post('/storage/lifecycle/create', request)
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '生命周期策略创建成功'
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
 */
export async function updateLifecyclePolicy(id: string, updates: Partial<LifecyclePolicy>) {
    try {
        const response = await api.post('/storage/lifecycle/update', { id, ...updates })
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '生命周期策略更新成功'
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
 */
export async function deleteLifecyclePolicy(id: string) {
    try {
        const response = await api.post('/storage/lifecycle/delete', { id })
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '生命周期策略删除成功'
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
 */
export async function toggleLifecyclePolicy(id: string, enabled: boolean) {
    try {
        const response = await api.post('/storage/lifecycle/toggle', { id, enabled })
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || (enabled ? '策略已启用' : '策略已禁用')
        }
    } catch (error) {
        console.error('切换生命周期策略状态失败:', error)
        return {
            success: false,
            data: null,
            message: '切换策略状态失败'
        }
    }
}

// ==================== 存储概览相关API ====================

/**
 * 获取存储概览统计信息
 */
export async function getStorageOverviewStats() {
    try {
        const response = await api.post('/storage/overview/stats', {})
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '获取存储统计信息成功'
        }
    } catch (error) {
        console.error('获取存储统计信息失败:', error)
        return {
            success: false,
            data: null,
            message: '获取存储统计信息失败'
        }
    }
}

/**
 * 获取存储类型分布数据
 */
export async function getStorageTypesDistribution() {
    try {
        const response = await api.post('/storage/overview/types-distribution', {})
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '获取存储类型分布成功'
        }
    } catch (error) {
        console.error('获取存储类型分布失败:', error)
        return {
            success: false,
            data: null,
            message: '获取存储类型分布失败'
        }
    }
}

/**
 * 获取存储节点状态列表
 */
export async function getStorageNodes() {
    try {
        const response = await api.post('/storage/overview/nodes', {})
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '获取存储节点列表成功'
        }
    } catch (error) {
        console.error('获取存储节点列表失败:', error)
        return {
            success: false,
            data: null,
            message: '获取存储节点列表失败'
        }
    }
}

/**
 * 获取存储性能数据
 */
export async function getStoragePerformanceData() {
    try {
        const response = await api.post('/storage/overview/performance', {})
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || '获取存储性能数据成功'
        }
    } catch (error) {
        console.error('获取存储性能数据失败:', error)
        return {
            success: false,
            data: null,
            message: '获取存储性能数据失败'
        }
    }
} 