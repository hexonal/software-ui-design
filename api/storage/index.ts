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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Volume'
 *             example:
 *               - id: "vol-1234567890abcdef0"
 *                 name: "data-volume-01"
 *                 size: 500
 *                 type: "SSD"
 *                 status: "attached"
 *                 attachedTo: "node-01"
 *                 createdAt: "2023-06-15T00:00:00.000Z"
 *                 iops: 3000
 *                 throughput: "250 MB/s"
 *                 usedSpace: 320
 *               - id: "vol-0987654321fedcba0"
 *                 name: "backup-volume-01"
 *                 size: 1000
 *                 type: "HDD"
 *                 status: "available"
 *                 attachedTo: null
 *                 createdAt: "2023-07-01T00:00:00.000Z"
 *                 iops: 1000
 *                 throughput: "100 MB/s"
 *                 usedSpace: 120
 */
export const getVolumes = async (params?: QueryParams): Promise<ApiResponse<Volume[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('volumes') as Volume[])
  }
  
  return api.get('/dfm/storage/volumes', { params })
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volume'
 *             example:
 *               id: "vol-1234567890abcdef0"
 *               name: "data-volume-01"
 *               size: 500
 *               type: "SSD"
 *               status: "attached"
 *               attachedTo: "node-01"
 *               createdAt: "2023-06-15T00:00:00.000Z"
 *               iops: 3000
 *               throughput: "250 MB/s"
 *               usedSpace: 320
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
  
  return api.get(`/dfm/storage/volumes/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volume'
 *             example:
 *               id: "vol-1234567890abcdef0"
 *               name: "data-volume-01"
 *               size: 500
 *               type: "SSD"
 *               status: "attached"
 *               attachedTo: "node-01"
 *               createdAt: "2023-06-15T00:00:00.000Z"
 *               iops: 3000
 *               throughput: "250 MB/s"
 *               usedSpace: 320
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
  
  return api.post('/dfm/storage/volumes', data)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volume'
 *             example:
 *               id: "vol-1234567890abcdef0"
 *               name: "data-volume-01"
 *               size: 500
 *               type: "SSD"
 *               status: "attached"
 *               attachedTo: "node-01"
 *               createdAt: "2023-06-15T00:00:00.000Z"
 *               iops: 3000
 *               throughput: "250 MB/s"
 *               usedSpace: 320
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
  
  return api.put(`/dfm/storage/volumes/${id}`, data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 */
export const deleteVolume = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/dfm/storage/volumes/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Snapshot'
 *             example:
 *               - id: "snap-0987654321fedcba0"
 *                 volumeId: "vol-1234567890abcdef0"
 *                 volumeName: "data-volume-01"
 *                 description: "Daily backup"
 *                 size: 320
 *                 status: "completed"
 *                 createdAt: "2023-10-01T00:00:00.000Z"
 *               - id: "snap-0987654321fedcba1"
 *                 volumeId: "vol-1234567890abcdef1"
 *                 volumeName: "data-volume-02"
 *                 description: "Pre-update snapshot"
 *                 size: 750
 *                 status: "completed"
 *                 createdAt: "2023-10-02T00:00:00.000Z"
 */
export const getSnapshots = async (params?: QueryParams): Promise<ApiResponse<Snapshot[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('snapshots') as Snapshot[])
  }
  
  return api.get('/dfm/storage/snapshots', { params })
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Snapshot'
 *             example:
 *               id: "snap-0987654321fedcba0"
 *               volumeId: "vol-1234567890abcdef0"
 *               volumeName: "data-volume-01"
 *               description: "Daily backup"
 *               size: 320
 *               status: "completed"
 *               createdAt: "2023-10-01T00:00:00.000Z"
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
  
  return api.get(`/dfm/storage/snapshots/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Snapshot'
 *             example:
 *               id: "snap-0987654321fedcba0"
 *               volumeId: "vol-1234567890abcdef0"
 *               volumeName: "data-volume-01"
 *               description: "Daily backup"
 *               size: 320
 *               status: "completed"
 *               createdAt: "2023-10-01T00:00:00.000Z"
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
  
  return api.post('/dfm/storage/snapshots', data)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 */
export const deleteSnapshot = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/dfm/storage/snapshots/${id}`)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   size:
 *                     type: string
 *                   items:
 *                     type: string
 *                   modified:
 *                     type: string
 *             example:
 *               - id: "folder-001"
 *                 name: "文档"
 *                 type: "folder"
 *                 size: "-"
 *                 items: 8
 *                 modified: "2023-05-08 14:30:22"
 *               - id: "file-001"
 *                 name: "系统架构.pdf"
 *                 type: "file"
 *                 size: "2.4 MB"
 *                 items: "-"
 *                 modified: "2023-05-10 09:12:33"
 */
export const getFiles = async (path: string = '/'): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('files') as any[])
  }
  
  return api.get('/dfm/storage/files', { params: { path } })
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 path:
 *                   type: string
 *                 fileName:
 *                   type: string
 *             example:
 *               success: true
 *               path: "/some/path"
 *               fileName: "example.txt"
 */
export const uploadFile = async (path: string, file: File): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟上传文件
    return mockResponse({ success: true, path, fileName: file.name })
  }
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)
  
  return api.post('/dfm/storage/files/upload', formData, {
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 */
export const deleteFile = async (path: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete('/dfm/storage/files', { params: { path } })
}