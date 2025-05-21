import { api } from '@/lib/api/client'
import { mockResponse, useMock, getMockData } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'
import { Node, Shard } from '@/mock/dashboard/types'

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
 */
export const getNodes = async (params?: QueryParams): Promise<ApiResponse<Node[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('nodes') as Node[])
  }
  
  return api.get('/cluster/nodes', { params })
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
 */
export const getNodeById = async (id: string): Promise<ApiResponse<Node | null>> => {
  if (useMock()) {
    const nodes = getMockData('nodes') as Node[]
    const node = nodes.find(n => n.id === id)
    
    if (!node) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(node)
  }
  
  return api.get(`/cluster/nodes/${id}`)
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
 */
export const createNode = async (data: Omit<Node, 'id'>): Promise<ApiResponse<Node>> => {
  if (useMock()) {
    // 模拟创建节点
    const newNode: Node = {
      id: `node-${Date.now()}`,
      ...data
    }
    return mockResponse(newNode)
  }
  
  return api.post('/cluster/nodes', data)
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
 */
export const updateNode = async (id: string, data: Partial<Node>): Promise<ApiResponse<Node | null>> => {
  if (useMock()) {
    const nodes = getMockData('nodes') as Node[]
    const nodeIndex = nodes.findIndex(n => n.id === id)
    
    if (nodeIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedNode = { ...nodes[nodeIndex], ...data }
    return mockResponse(updatedNode)
  }
  
  return api.put(`/cluster/nodes/${id}`, data)
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
 */
export const deleteNode = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/cluster/nodes/${id}`)
}

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
 */
export const getShards = async (params?: QueryParams): Promise<ApiResponse<Shard[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('shards') as Shard[])
  }
  
  return api.get('/cluster/shards', { params })
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
 */
export const getShardById = async (id: string): Promise<ApiResponse<Shard | null>> => {
  if (useMock()) {
    const shards = getMockData('shards') as Shard[]
    const shard = shards.find(s => s.id === id)
    
    if (!shard) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(shard)
  }
  
  return api.get(`/cluster/shards/${id}`)
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
 */
export const createShard = async (data: Omit<Shard, 'id'>): Promise<ApiResponse<Shard>> => {
  if (useMock()) {
    // 模拟创建分片
    const newShard: Shard = {
      id: `shard-${Date.now()}`,
      ...data
    }
    return mockResponse(newShard)
  }
  
  return api.post('/cluster/shards', data)
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
 */
export const updateShard = async (id: string, data: Partial<Shard>): Promise<ApiResponse<Shard | null>> => {
  if (useMock()) {
    const shards = getMockData('shards') as Shard[]
    const shardIndex = shards.findIndex(s => s.id === id)
    
    if (shardIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedShard = { ...shards[shardIndex], ...data }
    return mockResponse(updatedShard)
  }
  
  return api.put(`/cluster/shards/${id}`, data)
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
 */
export const deleteShard = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/cluster/shards/${id}`)
}