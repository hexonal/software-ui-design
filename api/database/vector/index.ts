import { api } from '@/lib/api/client'
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
 *                 efConstruction: 200
 *                 ef: 100
 */
export const getVectorIndexConfig = async (collectionId: string): Promise<ApiResponse<any>> => {
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
 *             type: "IVF_FLAT"
 *             parameters:
 *               nlist: 128
 *               nprobe: 10
 *     responses:
 *       200:
 *         description: 更新成功
 */
export const updateVectorIndexConfig = async (collectionId: string, data: any): Promise<ApiResponse<any>> => {
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
 *               vector:
 *                 type: array
 *                 items:
 *                   type: number
 *               topK:
 *                 type: integer
 *           example:
 *             vector: [0.1, 0.2, -0.3, 0.9]
 *             topK: 10
 *     responses:
 *       200:
 *         description: 搜索结果
 *         content:
 *           application/json:
 *             example:
 *               - id: "doc-001"
 *                 name: "文档标题 1"
 *                 score: 0.95
 *                 description: "搜索结果描述"
 */
export const searchVectors = async (collectionId: string, data: any): Promise<ApiResponse<any[]>> => {
  return api.post(`/dfm/database/vector/collections/${collectionId}/search`, data)
}