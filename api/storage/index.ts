import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { Volume, Snapshot } from '@/mock/dashboard/types'

/**
 * @openapi
 * /storage/volumes:
 *   get:
 *     summary: 获取所有卷
 *     tags:
 *       - Storage
 *     responses:
 *       200:
 *         description: 卷列表
 */
export const getVolumes = async (params?: QueryParams): Promise<ApiResponse<Volume[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('volumes') as Volume[])
  }
  
  return api.get('/storage/volumes', { params })
}

/**
 * @openapi
 * /storage/volumes/{id}:
 *   get:
 *     summary: 获取卷详情
 *     tags:
 *       - Storage
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 卷详情
 */
export const getVolumeById = async (id: string): Promise<ApiResponse<Volume | null>> => {
  if (useMock()) {
    const volumes = getMockData('volumes') as Volume[]
    const volume = volumes.find(v => v.id === id)
    
    if (!volume) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(volume)
  }
  
  return api.get(`/storage/volumes/${id}`)
}

/**
 * @openapi
 * /storage/volumes:
 *   post:
 *     summary: 创建卷
 *     tags:
 *       - Storage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volume'
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createVolume = async (data: Omit<Volume, 'id' | 'createdAt'>): Promise<ApiResponse<Volume>> => {
  if (useMock()) {
    // 模拟创建卷
    const newVolume: Volume = {
      id: `vol-${Date.now()}`,
      createdAt: new Date(),
      ...data
    }
    return mockResponse(newVolume)
  }
  
  return api.post('/storage/volumes', data)
}

/**
 * @openapi
 * /storage/volumes/{id}:
 *   put:
 *     summary: 更新卷
 *     tags:
 *       - Storage
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
 *             $ref: '#/components/schemas/Volume'
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateVolume = async (id: string, data: Partial<Volume>): Promise<ApiResponse<Volume>> => {
  if (useMock()) {
    const volumes = getMockData('volumes') as Volume[]
    const volumeIndex = volumes.findIndex(v => v.id === id)
    
    if (volumeIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedVolume = { ...volumes[volumeIndex], ...data }
    return mockResponse(updatedVolume)
  }
  
  return api.put(`/storage/volumes/${id}`, data)
}

/**
 * @openapi
 * /storage/volumes/{id}:
 *   delete:
 *     summary: 删除卷
 *     tags:
 *       - Storage
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
export const deleteVolume = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/storage/volumes/${id}`)
}

/**
 * @openapi
 * /storage/snapshots:
 *   get:
 *     summary: 获取所有快照
 *     tags:
 *       - Storage
 *     responses:
 *       200:
 *         description: 快照列表
 */
export const getSnapshots = async (params?: QueryParams): Promise<ApiResponse<Snapshot[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('snapshots') as Snapshot[])
  }
  
  return api.get('/storage/snapshots', { params })
}

/**
 * @openapi
 * /storage/snapshots/{id}:
 *   get:
 *     summary: 获取快照详情
 *     tags:
 *       - Storage
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 快照详情
 */
export const getSnapshotById = async (id: string): Promise<ApiResponse<Snapshot | null>> => {
  if (useMock()) {
    const snapshots = getMockData('snapshots') as Snapshot[]
    const snapshot = snapshots.find(s => s.id === id)
    
    if (!snapshot) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(snapshot)
  }
  
  return api.get(`/storage/snapshots/${id}`)
}

/**
 * @openapi
 * /storage/snapshots:
 *   post:
 *     summary: 创建快照
 *     tags:
 *       - Storage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Snapshot'
 *     responses:
 *       200:
 *         description: 创建成功
 */
export const createSnapshot = async (data: Omit<Snapshot, 'id' | 'createdAt'>): Promise<ApiResponse<Snapshot>> => {
  if (useMock()) {
    // 模拟创建快照
    const newSnapshot: Snapshot = {
      id: `snap-${Date.now()}`,
      createdAt: new Date(),
      ...data
    }
    return mockResponse(newSnapshot)
  }
  
  return api.post('/storage/snapshots', data)
}

/**
 * @openapi
 * /storage/snapshots/{id}:
 *   delete:
 *     summary: 删除快照
 *     tags:
 *       - Storage
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
export const deleteSnapshot = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/storage/snapshots/${id}`)
}

/**
 * @openapi
 * /storage/files:
 *   get:
 *     summary: 获取文件列表
 *     tags:
 *       - Storage
 *     parameters:
 *       - name: path
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 文件列表
 */
export const getFiles = async (path: string = '/'): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('files'))
  }
  
  return api.get('/storage/files', { params: { path } })
}

/**
 * @openapi
 * /storage/files/upload:
 *   post:
 *     summary: 上传文件
 *     tags:
 *       - Storage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               path:
 *                 type: string
 *     responses:
 *       200:
 *         description: 上传成功
 */
export const uploadFile = async (path: string, file: File): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟上传文件
    return mockResponse({ success: true, path, fileName: file.name })
  }
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  
  return api.post('/storage/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * @openapi
 * /storage/files:
 *   delete:
 *     summary: 删除文件
 *     tags:
 *       - Storage
 *     parameters:
 *       - name: path
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 */
export const deleteFile = async (path: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete('/storage/files', { params: { path } })
}