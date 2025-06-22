"use client"

import { useState, useEffect } from "react"
import { VideoIcon as Vector, Search, Filter, MoreHorizontal, Layers, Save, AlertTriangle, Plus, Trash2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 导入 API
import { vectorApi } from "@/api"

export default function VectorDatabasePage() {
  const [activeTab, setActiveTab] = useState("collections")
  const [similarity, setSimilarity] = useState(0.75)
  const [topK, setTopK] = useState(10) // 添加topK状态变量，默认返回10个结果
  const [searchQuery, setSearchQuery] = useState("一款高性能的笔记本电脑，适合开发和游戏")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [collectionSearchQuery, setCollectionSearchQuery] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)
  const [indexConfig, setIndexConfig] = useState<any>({
    type: "HNSW",
    parameters: {
      M: 16,
      efConstruction: 128,
      efSearch: 64
    }
  })
  const [isEditingIndex, setIsEditingIndex] = useState(false)
  const [isSavingIndex, setIsSavingIndex] = useState(false)
  const [isRebuildingIndex, setIsRebuildingIndex] = useState(false)
  const [newCollectionData, setNewCollectionData] = useState({
    name: "",
    dimensions: 1536,
    indexType: "HNSW"
  })

  // 错误处理帮助函数
  const getErrorMessage = (apiResponse: any, defaultMessage: string): string => {
    if (!apiResponse) return defaultMessage

    // 检查是否是空对象
    if (typeof apiResponse === 'object' && Object.keys(apiResponse).length === 0) {
      return "API返回空响应"
    }

    // 优先获取message字段
    if (apiResponse.message && typeof apiResponse.message === 'string') {
      return apiResponse.message
    }

    // 检查其他常见的错误字段
    if (apiResponse.error && typeof apiResponse.error === 'string') {
      return apiResponse.error
    }

    if (apiResponse.msg && typeof apiResponse.msg === 'string') {
      return apiResponse.msg
    }

    return defaultMessage
  }

  const getNetworkErrorMessage = (err: any, operationName: string): string => {
    if (err?.response?.data?.message) {
      return err.response.data.message
    }
    if (err?.message) {
      return `${operationName}失败: ${err.message}`
    }
    return `${operationName}失败: 网络错误`
  }

  // 获取向量集合
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("开始获取向量集合...")
        const response = await vectorApi.getVectorCollections()
        console.log("向量集合API响应:", response)

        // 优化响应处理逻辑
        const apiResponse = response.data as any;
        console.log("处理向量集合API响应:", {
          apiResponse,
          hasSuccess: 'success' in apiResponse,
          success: apiResponse?.success,
          hasData: 'data' in apiResponse,
          data: apiResponse?.data,
          code: apiResponse?.code,
          isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
        })

        // 增强响应验证：检查多种成功条件
        if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
          console.log("向量集合API调用成功，结果:", apiResponse.data)
          const collectionsData = apiResponse.data || []
          // 确保data是数组且过滤掉无效项，同时补齐缺失字段
          const validCollections = Array.isArray(collectionsData)
            ? collectionsData.filter(collection => collection && collection.id).map(collection => ({
              ...collection,
              name: collection.name || '未命名集合',
              dimensions: collection.dimensions || 0,
              vectors: collection.vectors || 0,
              indexType: collection.indexType || 'HNSW'
            }))
            : []
          setCollections(validCollections)
          if (validCollections.length > 0 && !selectedCollection) {
            setSelectedCollection(validCollections[0].id)
          }
        } else {
          console.error("向量集合API响应表示失败:", apiResponse)
          const errorMsg = getErrorMessage(apiResponse, "获取向量集合数据失败")
          setError(errorMsg)
        }
      } catch (err) {
        console.error("向量集合API调用出错:", err)
        const errorMsg = getNetworkErrorMessage(err, "获取向量集合")
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // 获取索引配置
  useEffect(() => {
    if (!selectedCollection) return

    const fetchIndexConfig = async () => {
      try {
        setError(null)
        console.log("开始获取索引配置...")
        const response = await vectorApi.getVectorIndexConfig(selectedCollection)
        console.log("索引配置API响应:", response)

        // 优化响应处理逻辑
        const apiResponse = response.data as any;
        console.log("处理索引配置API响应:", {
          apiResponse,
          hasSuccess: 'success' in apiResponse,
          success: apiResponse?.success,
          hasData: 'data' in apiResponse,
          data: apiResponse?.data,
          code: apiResponse?.code,
          isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
        })

        // 增强响应验证：检查多种成功条件
        if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
          console.log("索引配置API调用成功，结果:", apiResponse.data)
          // 确保索引配置对象的完整性
          const configData = apiResponse.data || {}
          setIndexConfig({
            type: configData.type || 'HNSW',
            parameters: {
              M: configData.parameters?.M || 16,
              efConstruction: configData.parameters?.efConstruction || 128,
              efSearch: configData.parameters?.efSearch || 64
            }
          })
        } else {
          console.error("索引配置API响应表示失败:", apiResponse)
          const errorMsg = getErrorMessage(apiResponse, "获取索引配置失败")
          setError(errorMsg)
        }
      } catch (err) {
        console.error("索引配置API调用出错:", err)
        const errorMsg = getNetworkErrorMessage(err, "获取索引配置")
        setError(errorMsg)
      }
    }

    fetchIndexConfig()
  }, [selectedCollection])

  const handleSearch = async () => {
    if (!selectedCollection) {
      setError("请先选择向量集合")
      return
    }

    if (!searchQuery.trim()) {
      setError("搜索查询不能为空")
      return
    }

    if (topK <= 0) {
      setError("返回结果数量必须大于0")
      return
    }

    try {
      setSearchLoading(true)
      setError(null)
      console.log("开始执行向量搜索...")
      console.log("搜索参数:", {
        selectedCollection,
        query: searchQuery,
        similarity,
        topK
      })

      // 使用 API 执行向量搜索
      const response = await vectorApi.searchVectors(selectedCollection, {
        query: searchQuery,
        similarity: similarity,
        topK: topK
      })
      console.log("向量搜索API响应:", response)

      // 优化响应处理逻辑
      const apiResponse = response.data as any;
      console.log("处理向量搜索API响应:", {
        apiResponse,
        hasSuccess: 'success' in apiResponse,
        success: apiResponse?.success,
        hasData: 'data' in apiResponse,
        data: apiResponse?.data,
        code: apiResponse?.code,
        isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
      })

      // 增强响应验证：检查多种成功条件
      if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
        console.log("向量搜索API调用成功，结果:", apiResponse.data)
        setSearchResults(apiResponse.data || null)
      } else {
        console.error("向量搜索API响应表示失败:", apiResponse)
        const errorMsg = getErrorMessage(apiResponse, "执行向量搜索失败")
        setError(errorMsg)
      }
    } catch (err) {
      console.error("向量搜索API调用出错:", err)
      const errorMsg = getNetworkErrorMessage(err, "执行向量搜索")
      setError(errorMsg)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCreateCollection = async () => {
    if (!newCollectionData.name) {
      setError("集合名称不能为空")
      return
    }

    if (newCollectionData.dimensions <= 0) {
      setError("维度必须大于0")
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("开始创建向量集合...")

      const response = await vectorApi.createVectorCollection({
        name: newCollectionData.name,
        dimensions: newCollectionData.dimensions,
        indexType: newCollectionData.indexType
      })
      console.log("创建向量集合API响应:", response)

      // 优化响应处理逻辑
      const apiResponse = response.data as any;
      console.log("处理创建向量集合API响应:", {
        apiResponse,
        hasSuccess: 'success' in apiResponse,
        success: apiResponse?.success,
        hasData: 'data' in apiResponse,
        data: apiResponse?.data,
        code: apiResponse?.code,
        isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
      })

      // 增强响应验证：检查多种成功条件
      if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
        console.log("创建向量集合API调用成功，结果:", apiResponse.data)
        const newCollection = apiResponse.data || {
          id: `collection-${Date.now()}`, // 确保有ID
          name: newCollectionData.name,
          dimensions: newCollectionData.dimensions,
          indexType: newCollectionData.indexType,
          vectors: 0
        }
        // 确保新集合有有效的id
        if (newCollection && newCollection.id) {
          setCollections([...collections, newCollection])
        }
        setIsCreateCollectionOpen(false)
        setNewCollectionData({
          name: "",
          dimensions: 1536,
          indexType: "HNSW"
        })
      } else {
        console.error("创建向量集合API响应表示失败:", apiResponse)
        const errorMsg = getErrorMessage(apiResponse, "创建向量集合失败")
        setError(errorMsg)
      }
    } catch (err) {
      console.error("创建向量集合API调用出错:", err)
      const errorMsg = getNetworkErrorMessage(err, "创建向量集合")
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCollection = async () => {
    if (!collectionToDelete) return

    try {
      setLoading(true)
      setError(null)
      console.log("开始删除向量集合...")

      const response = await vectorApi.deleteVectorCollection(collectionToDelete)
      console.log("删除向量集合API响应:", response)

      // 优化响应处理逻辑
      const apiResponse = response.data as any;
      console.log("处理删除向量集合API响应:", {
        apiResponse,
        hasSuccess: 'success' in apiResponse,
        success: apiResponse?.success,
        hasData: 'data' in apiResponse,
        data: apiResponse?.data,
        code: apiResponse?.code,
        isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
      })

      // 增强响应验证：检查多种成功条件
      if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
        console.log("删除向量集合API调用成功")
        const remainingCollections = collections.filter(c => c.id !== collectionToDelete)
        setCollections(remainingCollections)
        if (selectedCollection === collectionToDelete) {
          setSelectedCollection(remainingCollections.length > 0 && remainingCollections[0]?.id ? remainingCollections[0].id : null)
        }
        setIsConfirmDeleteOpen(false)
        setCollectionToDelete(null)
      } else {
        console.error("删除向量集合API响应表示失败:", apiResponse)
        const errorMsg = getErrorMessage(apiResponse, "删除向量集合失败")
        setError(errorMsg)
      }
    } catch (err) {
      console.error("删除向量集合API调用出错:", err)
      const errorMsg = getNetworkErrorMessage(err, "删除向量集合")
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateIndexConfig = async () => {
    if (!selectedCollection) return

    try {
      setIsSavingIndex(true)
      setError(null)
      console.log("开始更新索引配置...")

      const response = await vectorApi.updateVectorIndexConfig(selectedCollection, indexConfig)
      console.log("更新索引配置API响应:", response)

      // 优化响应处理逻辑
      const apiResponse = response.data as any;
      console.log("处理更新索引配置API响应:", {
        apiResponse,
        hasSuccess: 'success' in apiResponse,
        success: apiResponse?.success,
        hasData: 'data' in apiResponse,
        data: apiResponse?.data,
        code: apiResponse?.code,
        isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
      })

      // 增强响应验证：检查多种成功条件
      if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
        console.log("更新索引配置API调用成功，结果:", apiResponse.data)
        // 确保更新后的索引配置对象的完整性
        const configData = apiResponse.data || indexConfig
        setIndexConfig({
          type: configData.type || indexConfig.type || 'HNSW',
          parameters: {
            M: configData.parameters?.M || indexConfig.parameters?.M || 16,
            efConstruction: configData.parameters?.efConstruction || indexConfig.parameters?.efConstruction || 128,
            efSearch: configData.parameters?.efSearch || indexConfig.parameters?.efSearch || 64
          }
        })
        setIsEditingIndex(false)
      } else {
        console.error("更新索引配置API响应表示失败:", apiResponse)
        const errorMsg = getErrorMessage(apiResponse, "更新索引配置失败")
        setError(errorMsg)
      }
    } catch (err) {
      console.error("更新索引配置API调用出错:", err)
      const errorMsg = getNetworkErrorMessage(err, "更新索引配置")
      setError(errorMsg)
    } finally {
      setIsSavingIndex(false)
    }
  }

  const handleRebuildIndex = async () => {
    if (!selectedCollection) return

    try {
      setIsRebuildingIndex(true)
      setError(null)

      // 模拟重建索引
      setTimeout(() => {
        setIsRebuildingIndex(false)
      }, 3000)
    } catch (err) {
      setError('重建索引失败')
      console.error(err)
    }
  }

  // 过滤集合 - 确保collection及其属性存在
  const filteredCollections = collections.filter(collection =>
    collection &&
    collection.name &&
    collection.id && (
      collection.name.toLowerCase().includes(collectionSearchQuery.toLowerCase()) ||
      collection.id.toLowerCase().includes(collectionSearchQuery.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">向量数据库管理</h1>
          <p className="text-muted-foreground">管理和查询向量数据库</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Vector className="mr-2 h-4 w-4" />
                创建向量集合
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新向量集合</DialogTitle>
                <DialogDescription>创建一个新的向量集合用于存储和检索向量数据</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collection-name" className="text-right">
                    集合名称
                  </Label>
                  <Input
                    id="collection-name"
                    value={newCollectionData.name}
                    onChange={(e) => setNewCollectionData({ ...newCollectionData, name: e.target.value })}
                    placeholder="输入集合名称"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collection-dimensions" className="text-right">
                    向量维度
                  </Label>
                  <Input
                    id="collection-dimensions"
                    type="number"
                    value={newCollectionData.dimensions}
                    onChange={(e) => setNewCollectionData({ ...newCollectionData, dimensions: parseInt(e.target.value) || 0 })}
                    placeholder="输入向量维度"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collection-index-type" className="text-right">
                    索引类型
                  </Label>
                  <Select
                    value={newCollectionData.indexType}
                    onValueChange={(value) => setNewCollectionData({ ...newCollectionData, indexType: value })}
                  >
                    <SelectTrigger id="collection-index-type" className="col-span-3">
                      <SelectValue placeholder="选择索引类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HNSW">HNSW (层次可导航小世界图)</SelectItem>
                      <SelectItem value="IVF">IVF (倒排文件索引)</SelectItem>
                      <SelectItem value="FLAT">FLAT (暴力搜索)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateCollectionOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateCollection}>创建集合</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="collections">向量集合</TabsTrigger>
          <TabsTrigger value="indexes">索引管理</TabsTrigger>
          <TabsTrigger value="search">向量搜索</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索向量集合..."
                className="pl-8"
                value={collectionSearchQuery}
                onChange={(e) => setCollectionSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCollectionSearchQuery("")}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">重置筛选</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                try {
                  setLoading(true)
                  setError(null)
                  console.log("刷新向量集合数据...")
                  const response = await vectorApi.getVectorCollections()
                  console.log("刷新向量集合API响应:", response)

                  // 优化响应处理逻辑
                  const apiResponse = response.data as any;
                  console.log("处理刷新向量集合API响应:", {
                    apiResponse,
                    hasSuccess: 'success' in apiResponse,
                    success: apiResponse?.success,
                    hasData: 'data' in apiResponse,
                    data: apiResponse?.data,
                    code: apiResponse?.code,
                    isValidResponse: apiResponse && (apiResponse.success === true || apiResponse.code === 200)
                  })

                  // 增强响应验证：检查多种成功条件
                  if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
                    console.log("刷新向量集合API调用成功，结果:", apiResponse.data)
                    const collectionsData = apiResponse.data || []
                    // 确保数据是数组格式且过滤掉无效项，同时补齐缺失字段
                    if (Array.isArray(collectionsData)) {
                      const validCollections = collectionsData.filter(collection => collection && collection.id).map(collection => ({
                        ...collection,
                        name: collection.name || '未命名集合',
                        dimensions: collection.dimensions || 0,
                        vectors: collection.vectors || 0,
                        indexType: collection.indexType || 'HNSW'
                      }))
                      setCollections(validCollections)
                    } else {
                      console.warn("向量集合数据不是数组格式:", collectionsData)
                      setCollections([])
                    }
                  } else {
                    console.error("刷新向量集合API响应表示失败:", apiResponse)
                    const errorMsg = getErrorMessage(apiResponse, "刷新向量集合失败")
                    setError(errorMsg)
                  }
                } catch (err) {
                  console.error("刷新向量集合API调用出错:", err)
                  const errorMsg = getNetworkErrorMessage(err, "刷新向量集合")
                  setError(errorMsg)
                } finally {
                  setLoading(false)
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">刷新</span>
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
              <div>ID</div>
              <div>名称</div>
              <div>维度</div>
              <div>向量数量</div>
              <div>索引类型</div>
              <div className="text-right">操作</div>
            </div>
            <div className="divide-y">
              {loading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">加载中...</p>
                </div>
              ) : filteredCollections.length === 0 ? (
                <div className="py-8 text-center">
                  <Vector className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {collections.length === 0 ? "暂无向量集合数据" : "没有匹配的向量集合"}
                  </p>
                  {collections.length === 0 && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsCreateCollectionOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      创建第一个向量集合
                    </Button>
                  )}
                </div>
              ) : (
                filteredCollections.map((collection, index) => (
                  <div key={collection.id || `collection-${index}`} className="grid grid-cols-6 items-center px-4 py-3 text-sm">
                    <div className="font-medium">{collection.id || '-'}</div>
                    <div>{collection.name || '-'}</div>
                    <div>{collection.dimensions || '-'}</div>
                    <div>{(collection.vectors || 0).toLocaleString()}</div>
                    <div>
                      <Badge variant="outline">{collection.indexType || 'HNSW'}</Badge>
                    </div>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">操作</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>集合操作</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedCollection(collection.id)
                            setActiveTab("indexes")
                          }}>
                            <Layers className="mr-2 h-4 w-4" />
                            管理索引
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedCollection(collection.id)
                            setActiveTab("search")
                          }}>
                            <Search className="mr-2 h-4 w-4" />
                            搜索向量
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCollectionToDelete(collection.id)
                              setIsConfirmDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除集合
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="indexes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>索引管理</CardTitle>
                  <CardDescription>管理向量集合的索引</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedCollection || ""}
                    onValueChange={setSelectedCollection}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="选择向量集合" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map((collection, index) => (
                        <SelectItem key={collection.id || `select-collection-${index}`} value={collection.id || `collection-${index}`}>
                          {collection.name || '未命名'} ({collection.id || `collection-${index}`})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedCollection ? (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Vector className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">未选择向量集合</h3>
                    <p className="mt-1 text-sm text-muted-foreground">请从上方下拉菜单中选择一个向量集合</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">索引配置</h3>
                    <Badge>{indexConfig.type || 'HNSW'}</Badge>
                  </div>

                  <div className="space-y-4">
                    {isEditingIndex ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>M 参数 (邻居数量)</Label>
                            <span className="text-sm font-medium">{indexConfig.parameters?.M || 16}</span>
                          </div>
                          <Slider
                            value={[indexConfig.parameters?.M || 16]}
                            min={4}
                            max={64}
                            step={4}
                            onValueChange={(value) => setIndexConfig({
                              ...indexConfig,
                              parameters: {
                                ...indexConfig.parameters,
                                M: value[0]
                              }
                            })}
                          />
                          <p className="text-xs text-muted-foreground">每个节点的最大连接数，影响查询精度和内存使用</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>ef_construction 参数</Label>
                            <span className="text-sm font-medium">{indexConfig.parameters?.efConstruction || 128}</span>
                          </div>
                          <Slider
                            value={[indexConfig.parameters?.efConstruction || 128]}
                            min={64}
                            max={512}
                            step={64}
                            onValueChange={(value) => setIndexConfig({
                              ...indexConfig,
                              parameters: {
                                ...indexConfig.parameters,
                                efConstruction: value[0]
                              }
                            })}
                          />
                          <p className="text-xs text-muted-foreground">
                            构建索引时的动态候选列表大小，影响索引质量和构建时间
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>ef_search 参数</Label>
                            <span className="text-sm font-medium">{indexConfig.parameters?.efSearch || 64}</span>
                          </div>
                          <Slider
                            value={[indexConfig.parameters?.efSearch || 64]}
                            min={16}
                            max={256}
                            step={16}
                            onValueChange={(value) => setIndexConfig({
                              ...indexConfig,
                              parameters: {
                                ...indexConfig.parameters,
                                efSearch: value[0]
                              }
                            })}
                          />
                          <p className="text-xs text-muted-foreground">搜索时的动态候选列表大小，影响查询精度和速度</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">索引类型</Label>
                            <div className="font-medium">{indexConfig.type || 'HNSW'}</div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">M 参数 (邻居数量)</Label>
                            <div className="font-medium">{indexConfig.parameters?.M || 16}</div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">ef_construction 参数</Label>
                            <div className="font-medium">{indexConfig.parameters?.efConstruction || 128}</div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-sm text-muted-foreground">ef_search 参数</Label>
                            <div className="font-medium">{indexConfig.parameters?.efSearch || 64}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>
                            <strong>HNSW (层次可导航小世界图)</strong> 是一种高效的近似最近邻搜索算法，适用于高维向量搜索。
                            它通过构建多层图结构，在保持高查询精度的同时显著提高搜索速度。
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between gap-2">
                    {isEditingIndex ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // 重置为默认值
                            setIndexConfig({
                              type: "HNSW",
                              parameters: {
                                M: 16,
                                efConstruction: 128,
                                efSearch: 64
                              }
                            })
                          }}
                        >
                          重置为默认值
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditingIndex(false)}
                          >
                            取消
                          </Button>
                          <Button
                            onClick={handleUpdateIndexConfig}
                            disabled={isSavingIndex}
                          >
                            {isSavingIndex ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                保存中...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                保存配置
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleRebuildIndex}
                          disabled={isRebuildingIndex}
                        >
                          {isRebuildingIndex ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              重建中...
                            </>
                          ) : (
                            <>
                              <Layers className="mr-2 h-4 w-4" />
                              重建索引
                            </>
                          )}
                        </Button>
                        <Button onClick={() => setIsEditingIndex(true)}>
                          <Save className="mr-2 h-4 w-4" />
                          编辑配置
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>向量搜索</CardTitle>
              <CardDescription>使用文本查询相似的向量</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedCollection || ""}
                  onValueChange={setSelectedCollection}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="选择向量集合" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection, index) => (
                      <SelectItem key={collection.id || `search-collection-${index}`} value={collection.id || `collection-${index}`}>
                        {collection.name || '未命名'} ({collection.id || `collection-${index}`})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search-query">搜索查询</Label>
                <Textarea
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入搜索文本..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>相似度阈值</Label>
                  <span className="text-sm font-medium">{similarity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[similarity]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setSimilarity(value[0])}
                />
                <p className="text-xs text-muted-foreground">设置最小相似度阈值，只返回相似度高于此值的结果</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>返回结果数量</Label>
                  <span className="text-sm font-medium">{topK}</span>
                </div>
                <Slider
                  value={[topK]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setTopK(value[0])}
                />
                <p className="text-xs text-muted-foreground">设置最多返回多少个搜索结果，范围：1-100</p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSearch}
                  disabled={searchLoading || !selectedCollection || !searchQuery.trim() || topK <= 0}
                >
                  {searchLoading ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      搜索
                    </>
                  )}
                </Button>
              </div>

              {searchResults && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      搜索结果: <span className="font-medium">
                        {Array.isArray(searchResults) ? searchResults.length : 0} 个
                      </span>
                      {topK && (
                        <span className="text-muted-foreground ml-1">
                          (最多 {topK} 个)
                        </span>
                      )}
                    </div>
                    <div>
                      执行时间: <span className="font-medium">0.045 秒</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Array.isArray(searchResults) ? searchResults.map((result: any, index: number) => (
                      <div key={result.id || `search-result-${index}`} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{result.name || '未命名结果'}</div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            相似度: {(result.score || result.similarity || 0).toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{result.description || result.content || '暂无描述'}</p>
                        <div className="text-xs text-muted-foreground mt-2">ID: {result.id || `result-${index}`}</div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-muted-foreground">
                        搜索结果格式异常
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 确认删除对话框 */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除向量集合</DialogTitle>
            <DialogDescription>
              您确定要删除此向量集合吗？此操作不可撤销，将永久删除该集合及其所有向量数据。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>危险操作</AlertTitle>
              <AlertDescription>
                删除向量集合将永久移除所有存储的向量数据和索引。此操作无法恢复。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}