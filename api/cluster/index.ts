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
 *         content:
 *           application/json:
 *             example:
 *               - id: "node-01"
 *                 name: "节点 1"
 *                 ip: "192.168.1.101"
 *                 role: "主节点"
 *                 status: "在线"
 *                 cpu: 45
 *                 memory: 62
 *                 disk: 38
 *               - id: "node-02"
 *                 name: "节点 2"
 *                 ip: "192.168.1.102"
 *                 role: "主节点"
 *                 status: "在线"
 *                 cpu: 32
 *                 memory: 48
 *                 disk: 55
 *               - id: "node-03"
 *                 name: "节点 3"
 *                 ip: "192.168.1.103"
 *                 role: "数据节点"
 *                 status: "在线"
 *                 cpu: 78
 *                 memory: 85
 *                 disk: 72
 *               - id: "node-04"
 *                 name: "节点 4"
 *                 ip: "192.168.1.104"
 *                 role: "数据节点"
 *                 status: "在线"
 *                 cpu: 25
 *                 memory: 42
 *                 disk: 30
 *               - id: "node-05"
 *                 name: "节点 5"
 *                 ip: "192.168.1.105"
 *                 role: "数据节点"
 *                 status: "离线"
 *                 cpu: 0
 *                 memory: 0
 *                 disk: 0
 */
export const getNodes = async (params?: QueryParams): Promise<ApiResponse<Node[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('nodes') as Node[])
  }
  
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
 *             example:
 *               id: "node-01"
 *               name: "节点 1"
 *               ip: "192.168.1.101"
 *               role: "主节点"
 *               status: "在线"
 *               cpu: 45
 *               memory: 62
 *               disk: 38
 */
export const getNodeById = async (id: number): Promise<ApiResponse<Node | null>> => {
  if (useMock()) {
    const nodes = getMockData('nodes') as Node[]
    const node = nodes.find(n => n.id === id.toString())
    
    if (!node) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(node)
  }
  
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
 */
export const updateNode = async (id: number, data: Partial<Node>): Promise<ApiResponse<Node | null>> => {
  if (useMock()) {
    const nodes = getMockData('nodes') as Node[]
    const nodeIndex = nodes.findIndex(n => n.id === id.toString())
    
    if (nodeIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedNode = { ...nodes[nodeIndex], ...data }
    return mockResponse(updatedNode)
  }
  
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
 */
export const deleteNode = async (id: number): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/dfm/cluster/nodes/${id}`)
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
 *         content:
 *           application/json:
 *             example:
 *               - id: "shard-01"
 *                 range: "0-1023"
 *                 nodeId: "node-01"
 *                 status: "活跃"
 *                 size: "245 GB"
 *                 usage: 62
 *                 replicas: 2
 *               - id: "shard-02"
 *                 range: "1024-2047"
 *                 nodeId: "node-02"
 *                 status: "活跃"
 *                 size: "312 GB"
 *                 usage: 78
 *                 replicas: 2
 *               - id: "shard-03"
 *                 range: "2048-3071"
 *                 nodeId: "node-03"
 *                 status: "活跃"
 *                 size: "178 GB"
 *                 usage: 45
 *                 replicas: 2
 *               - id: "shard-04"
 *                 range: "3072-4095"
 *                 nodeId: "node-04"
 *                 status: "活跃"
 *                 size: "203 GB"
 *                 usage: 51
 *                 replicas: 2
 *               - id: "shard-05"
 *                 range: "4096-5119"
 *                 nodeId: "node-01"
 *                 status: "活跃"
 *                 size: "267 GB"
 *                 usage: 67
 *                 replicas: 2
 */
export const getShards = async (params?: QueryParams): Promise<ApiResponse<Shard[]>> => {
  if (useMock()) {
    return mockResponse(getMockData('shards') as Shard[])
  }
  
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
 *             example:
 *               id: "shard-01"
 *               range: "0-1023"
 *               nodeId: "node-01"
 *               status: "活跃"
 *               size: "245 GB"
 *               usage: 62
 *               replicas: 2
 */
export const getShardById = async (id: number): Promise<ApiResponse<Shard | null>> => {
  if (useMock()) {
    const shards = getMockData('shards') as Shard[]
    const shard = shards.find(s => s.id === id.toString())
    
    if (!shard) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(shard)
  }
  
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
 *           example:
 *             range: "0-1023"
 *             nodeId: "node-01"
 *             status: "活跃"
 *             size: "245 GB"
 *             usage: 62
 *             replicas: 2
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
 *           example:
 *             range: "0-1023"
 *             nodeId: "node-01"
 *             status: "活跃"
 *             size: "245 GB"
 *             usage: 62
 *             replicas: 2
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateShard = async (id: number, data: Partial<Shard>): Promise<ApiResponse<Shard | null>> => {
  if (useMock()) {
    const shards = getMockData('shards') as Shard[]
    const shardIndex = shards.findIndex(s => s.id === id.toString())
    
    if (shardIndex === -1) {
      return mockResponse(null, true, 404)
    }
    
    const updatedShard = { ...shards[shardIndex], ...data }
    return mockResponse(updatedShard)
  }
  
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
 *             example:
 *               success: true
 */
export const deleteShard = async (id: number): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/dfm/cluster/shards/${id}`)
}