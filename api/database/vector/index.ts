import { api } from '@/lib/api/client'
import { mockResponse, useMock } from '@/lib/api/mock-handler'
import { ApiResponse, PaginatedData, QueryParams } from '@/lib/api/types'

/**
 * @openapi
 * /database/vector/collections:
 *   get:
 *     summary: 获取向量集合列表
 *     tags:
 *       - Vector
 *     responses:
 *       200:
 *         description: 向量集合列表
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
 *                   dimensions:
 *                     type: integer
 *                   vectors:
 *                     type: integer
 *                   indexType:
 *                     type: string
 *             example:
 *               - id: "product-embeddings"
 *                 name: "产品向量"
 *                 dimensions: 1536
 *                 vectors: 125000
 *                 indexType: "HNSW"
 *               - id: "document-embeddings"
 *                 name: "文档向量"
 *                 dimensions: 768
 *                 vectors: 85000
 *                 indexType: "HNSW"
 */
export const getVectorCollections = async (params?: QueryParams): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟向量集合数据
    const collections = [
      { id: "product-embeddings", name: "产品向量", dimensions: 1536, vectors: 125000, indexType: "HNSW" },
      { id: "document-embeddings", name: "文档向量", dimensions: 768, vectors: 85000, indexType: "HNSW" },
      { id: "image-embeddings", name: "图像向量", dimensions: 512, vectors: 250000, indexType: "IVF" },
      { id: "user-embeddings", name: "用户向量", dimensions: 384, vectors: 50000, indexType: "HNSW" },
    ]
    
    return mockResponse(collections)
  }
  
  return api.get('/dfm/database/vector/collections', { params })
}

/**
 * @openapi
 * /database/vector/collections/{id}:
 *   get:
 *     summary: 获取向量集合详情
 *     tags:
 *       - Vector
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 向量集合详情
 *         content:
 *           application/json:
 *             example:
 *               id: "product-embeddings"
 *               name: "产品向量"
 *               dimensions: 1536
 *               vectors: 125000
 *               indexType: "HNSW"
 *               description: "产品描述和特征的向量表示"
 */
export const getVectorCollectionById = async (id: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    const collections = [
      { id: "product-embeddings", name: "产品向量", dimensions: 1536, vectors: 125000, indexType: "HNSW", description: "产品描述和特征的向量表示" },
      { id: "document-embeddings", name: "文档向量", dimensions: 768, vectors: 85000, indexType: "HNSW", description: "文档内容的向量表示" },
      { id: "image-embeddings", name: "图像向量", dimensions: 512, vectors: 250000, indexType: "IVF", description: "图像特征的向量表示" },
      { id: "user-embeddings", name: "用户向量", dimensions: 384, vectors: 50000, indexType: "HNSW", description: "用户偏好的向量表示" },
    ]
    
    const collection = collections.find(c => c.id === id)
    
    if (!collection) {
      return mockResponse(null, true, 404)
    }
    
    return mockResponse(collection)
  }
  
  return api.get(`/dfm/database/vector/collections/${id}`)
}

/**
 * @openapi
 * /database/vector/collections:
 *   post:
 *     summary: 创建向量集合
 *     tags:
 *       - Vector
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dimensions:
 *                 type: integer
 *               indexType:
 *                 type: string
 *           example:
 *             name: "new-collection"
 *             dimensions: 768
 *             indexType: "HNSW"
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             example:
 *               id: "collection-1678886400000"
 *               name: "new-collection"
 *               dimensions: 768
 *               vectors: 0
 *               indexType: "HNSW"
 */
export const createVectorCollection = async (data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟创建向量集合
    const newCollection = {
      id: `collection-${Date.now()}`,
      ...data
    }
    return mockResponse(newCollection)
  }
  
  return api.post('/dfm/database/vector/collections', data)
}

/**
 * @openapi
 * /database/vector/collections/{id}:
 *   put:
 *     summary: 更新向量集合
 *     tags:
 *       - Vector
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "updated-collection-name"
 *             description: "updated-description"
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             example:
 *               id: "collection-1678886400000"
 *               name: "updated-collection-name"
 *               description: "updated-description"
 */
export const updateVectorCollection = async (id: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({
      id,
      ...data
    })
  }
  
  return api.put(`/dfm/database/vector/collections/${id}`, data)
}

/**
 * @openapi
 * /database/vector/collections/{id}:
 *   delete:
 *     summary: 删除向量集合
 *     tags:
 *       - Vector
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
export const deleteVectorCollection = async (id: string): Promise<ApiResponse<boolean>> => {
  if (useMock()) {
    return mockResponse(true)
  }
  
  return api.delete(`/dfm/database/vector/collections/${id}`)
}

/**
 * @openapi
 * /database/vector/collections/{collectionId}/index:
 *   get:
 *     summary: 获取向量索引配置
 *     tags:
 *       - Vector
 *     parameters:
 *       - name: collectionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 索引配置
 *         content:
 *           application/json:
 *             example:
 *               type: "HNSW"
 *               parameters:
 *                 M: 16
 *                 efConstruction: 128
 *                 efSearch: 64
 */
export const getVectorIndexConfig = async (collectionId: string): Promise<ApiResponse<any>> => {
  if (useMock()) {
    // 模拟索引配置
    return mockResponse({
      type: "HNSW",
      parameters: {
        M: 16,
        efConstruction: 128,
        efSearch: 64
      }
    })
  }
  
  return api.get(`/dfm/database/vector/collections/${collectionId}/index`)
}

/**
 * @openapi
 * /database/vector/collections/{collectionId}/index:
 *   put:
 *     summary: 更新向量索引配置
 *     tags:
 *       - Vector
 *     parameters:
 *       - name: collectionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               parameters:
 *                 type: object
 *           example:
 *             type: "IVF"
 *             parameters:
 *               nlist: 128
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             example:
 *               type: "IVF"
 *               parameters:
 *                 nlist: 128
 */
export const updateVectorIndexConfig = async (collectionId: string, data: any): Promise<ApiResponse<any>> => {
  if (useMock()) {
    return mockResponse({
      type: data.type,
      parameters: data.parameters
    })
  }
  
  return api.put(`/dfm/database/vector/collections/${collectionId}/index`, data)
}

/**
 * @openapi
 * /database/vector/collections/{collectionId}/search:
 *   post:
 *     summary: 向量搜索
 *     tags:
 *       - Vector
 *     parameters:
 *       - name: collectionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               topK:
 *                 type: integer
 *           example:
 *             query: "高性能笔记本"
 *             topK: 3
 *     responses:
 *       200:
 *         description: 搜索结果
 *         content:
 *           application/json:
 *             example:
 *               - id: "prod-1234"
 *                 name: "超能开发者笔记本 Pro"
 *                 score: 0.92
 *                 description: "高性能开发者笔记本，搭载最新处理器和独立显卡，适合编程和游戏"
 *               - id: "prod-2345"
 *                 name: "游戏战神笔记本 X1"
 *                 score: 0.87
 *                 description: "专业游戏笔记本，高刷新率屏幕，强劲散热系统，畅玩各类大型游戏"
 */
export const searchVectors = async (collectionId: string, query: string, options?: any): Promise<ApiResponse<any[]>> => {
  if (useMock()) {
    // 模拟搜索结果
    const results = [
      {
        id: "prod-1234",
        name: "超能开发者笔记本 Pro",
        score: 0.92,
        description: "高性能开发者笔记本，搭载最新处理器和独立显卡，适合编程和游戏",
      },
      {
        id: "prod-2345",
        name: "游戏战神笔记本 X1",
        score: 0.87,
        description: "专业游戏笔记本，高刷新率屏幕，强劲散热系统，畅玩各类大型游戏",
      },
      {
        id: "prod-3456",
        name: "轻薄商务本 Air",
        score: 0.76,
        description: "轻薄商务笔记本，长续航，适合商务办公和轻度开发",
      },
      {
        id: "prod-4567",
        name: "全能创作者本 Creator",
        score: 0.72,
        description: "面向创意工作者的笔记本，色彩准确的屏幕，适合设计和开发",
      },
    ]
    
    return mockResponse(results)
  }
  
  return api.post(`/dfm/database/vector/collections/${collectionId}/search`, { query, ...options })
}