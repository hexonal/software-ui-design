import { api } from '@/lib/api/client'
import { ApiResponse, QueryParams } from '@/lib/api/types'
import { Node, Shard } from '@/lib/types'

/**
 * @openapi
 * /cluster/nodes:
 *   get:
 *     summary: 获取所有节点
 *     tags:
 *       - Cluster
 *     responses:
 *       200:
 *         description: 节点列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Node'
 */
export const getNodes = async (params?: QueryParams): Promise<ApiResponse<Node[]>> => {
  return api.get('/dfm/cluster/nodes', { params })
}

/**
 * @openapi
 * /cluster/nodes/{id}:
 *   get:
 *     summary: 获取节点详情
 *     tags:
 *       - Cluster
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 节点详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Node'
 */
export const getNodeById = async (id: number): Promise<ApiResponse<Node | null>> => {
  return api.get(`/dfm/cluster/nodes/${id}`)
}

/**
 * @openapi
 * /cluster/nodes:
 *   post:
 *     summary: 创建节点
 *     tags:
 *       - Cluster
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Node'
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Node'
 */
export const createNode = async (data: Omit<Node, 'id'>): Promise<ApiResponse<Node>> => {
  return api.post('/dfm/cluster/nodes', data)
}

/**
 * @openapi
 * /cluster/nodes/{id}:
 *   put:
 *     summary: 更新节点
 *     tags:
 *       - Cluster
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
 *             $ref: '#/components/schemas/Node'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Node'
 */
export const updateNode = async (id: number, data: Partial<Node>): Promise<ApiResponse<Node | null>> => {
  return api.put(`/dfm/cluster/nodes/${id}`, data)
}

/**
 * @openapi
 * /cluster/nodes/{id}:
 *   delete:
 *     summary: 删除节点
 *     tags:
 *       - Cluster
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
export const deleteNode = async (id: number): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/cluster/nodes/${id}`)
}

// ================= 分片管理 =================

/**
 * @openapi
 * /cluster/shards:
 *   get:
 *     summary: 获取所有分片
 *     tags:
 *       - Cluster
 *     responses:
 *       200:
 *         description: 分片列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shard'
 */
export const getShards = async (params?: QueryParams): Promise<ApiResponse<Shard[]>> => {
  return api.get('/dfm/cluster/shards', { params })
}

/**
 * @openapi
 * /cluster/shards/{id}:
 *   get:
 *     summary: 获取分片详情
 *     tags:
 *       - Cluster
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 分片详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shard'
 */
export const getShardById = async (id: number): Promise<ApiResponse<Shard | null>> => {
  return api.get(`/dfm/cluster/shards/${id}`)
}

/**
 * @openapi
 * /cluster/shards:
 *   post:
 *     summary: 创建分片
 *     tags:
 *       - Cluster
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shard'
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shard'
 */
export const createShard = async (data: Omit<Shard, 'id'>): Promise<ApiResponse<Shard>> => {
  return api.post('/dfm/cluster/shards', data)
}

/**
 * @openapi
 * /cluster/shards/{id}:
 *   put:
 *     summary: 更新分片
 *     tags:
 *       - Cluster
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
 *             $ref: '#/components/schemas/Shard'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shard'
 */
export const updateShard = async (id: number, data: Partial<Shard>): Promise<ApiResponse<Shard | null>> => {
  return api.put(`/dfm/cluster/shards/${id}`, data)
}

/**
 * @openapi
 * /cluster/shards/{id}:
 *   delete:
 *     summary: 删除分片
 *     tags:
 *       - Cluster
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
export const deleteShard = async (id: number): Promise<ApiResponse<boolean>> => {
  return api.delete(`/dfm/cluster/shards/${id}`)
}