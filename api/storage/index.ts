import { api } from '@/lib/api/client'
import { ApiResponse, QueryParams } from '@/lib/api/types'
import { Volume, Snapshot } from '@/lib/types'

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
 */
export const getVolumes = async (params?: QueryParams): Promise<ApiResponse<Volume[]>> => {
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
 */
export const getVolumeById = async (id: string): Promise<ApiResponse<Volume | null>> => {
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
 */
export const createVolume = async (data: Omit<Volume, 'id' | 'createdAt'>): Promise<ApiResponse<Volume>> => {
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
 */
export const updateVolume = async (id: string, data: Partial<Volume>): Promise<ApiResponse<Volume>> => {
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
 */
export const deleteVolume = async (id: string): Promise<ApiResponse<boolean>> => {
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
 */
export const getSnapshots = async (params?: QueryParams): Promise<ApiResponse<Snapshot[]>> => {
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
 */
export const getSnapshotById = async (id: string): Promise<ApiResponse<Snapshot | null>> => {
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
 */
export const createSnapshot = async (data: Omit<Snapshot, 'id' | 'createdAt'>): Promise<ApiResponse<Snapshot>> => {
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
 */
export const deleteSnapshot = async (id: string): Promise<ApiResponse<boolean>> => {
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
 *           default: "/"
 *         description: 文件路径
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
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   size:
 *                     type: string
 *                   modified:
 *                     type: string
 */
export const getFiles = async (path: string = '/'): Promise<ApiResponse<any[]>> => {
  return api.get('/dfm/storage/files', { params: { path } })
}

/**
 * @openapi
 * /storage/files/upload:
 *   post:
 *     summary: 上传文件
 *     tags:
 *       - Storage
 *     parameters:
 *       - name: path
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 上传路径
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
 */
export const uploadFile = async (path: string, file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', path)

  return api.post('/dfm/storage/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
 *         description: 文件路径
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
 */
export const deleteFile = async (path: string): Promise<ApiResponse<boolean>> => {
  return api.delete('/dfm/storage/files', { params: { path } })
}