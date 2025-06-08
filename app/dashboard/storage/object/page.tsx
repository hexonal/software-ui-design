"use client"

import { useState, useEffect } from "react"
import {
  Check,
  Download,
  FileText,
  Globe,
  Link,
  Lock,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Upload,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getBuckets, getObjects, getLifecyclePolicies, LifecyclePolicy } from "@/lib/api/storage"

// 类型定义
interface StorageBucket {
  id: string
  name: string
  region: string
  access: "public" | "private"
  objectCount: number
  size: number
  createdAt: Date
}

interface StorageObject {
  key: string
  bucketName: string
  size: number
  type: string
  lastModified: Date
  access: "public" | "private"
}

// 访问权限标签颜色映射
const accessColors: Record<"public" | "private", string> = {
  public: "yellow",
  private: "green",
}

export default function ObjectStoragePage() {
  const [searchBucket, setSearchBucket] = useState("")
  const [searchObject, setSearchObject] = useState("")
  const [selectedBucketAccess, setSelectedBucketAccess] = useState("all")
  const [selectedBucket, setSelectedBucket] = useState("all")

  // 数据状态
  const [buckets, setBuckets] = useState<StorageBucket[]>([])
  const [objects, setObjects] = useState<StorageObject[]>([])
  const [lifecyclePolicies, setLifecyclePolicies] = useState<LifecyclePolicy[]>([])
  const [loading, setLoading] = useState({
    buckets: true,
    objects: true,
    lifecycle: true,
  })
  const [error, setError] = useState<string | null>(null)

  // 获取存储桶列表
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        setLoading(prev => ({ ...prev, buckets: true }))
        setError(null)

        // 调用实际的API
        const response = await getBuckets()
        if (response.success) {
          setBuckets(response.data.map(bucket => ({
            ...bucket,
            createdAt: new Date(bucket.createdAt)
          })))
        } else {
          setError(response.message || '获取存储桶失败')
        }

      } catch (err) {
        console.error('获取存储桶失败:', err)
        setError('获取存储桶失败')
      } finally {
        setLoading(prev => ({ ...prev, buckets: false }))
      }
    }

    fetchBuckets()
  }, [])

  // 获取对象列表
  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(prev => ({ ...prev, objects: true }))
        setError(null)

        // 调用实际的API
        const response = await getObjects()
        if (response.success) {
          setObjects(response.data.map(obj => ({
            ...obj,
            lastModified: new Date(obj.lastModified)
          })))
        } else {
          setError(response.message || '获取对象失败')
        }

      } catch (err) {
        console.error('获取对象失败:', err)
        setError('获取对象失败')
      } finally {
        setLoading(prev => ({ ...prev, objects: false }))
      }
    }

    fetchObjects()
  }, [])

  // 获取生命周期策略列表
  useEffect(() => {
    const fetchLifecyclePolicies = async () => {
      try {
        setLoading(prev => ({ ...prev, lifecycle: true }))
        setError(null)

        // 调用实际的API
        const response = await getLifecyclePolicies()
        console.log('生命周期策略 API 响应:', response) // 调试信息

        if (response.success) {
          // 确保 response.data 是数组
          if (Array.isArray(response.data)) {
            setLifecyclePolicies(response.data)
          } else {
            console.warn('生命周期策略数据不是数组格式:', response.data)
            setLifecyclePolicies([]) // 设置为空数组
            setError('生命周期策略数据格式错误')
          }
        } else {
          // 如果后端API未实现，使用空数组而不是显示错误
          console.warn('获取生命周期策略失败，使用空数组:', response.message)
          setLifecyclePolicies([])
          // 暂时不设置错误，因为后端可能还未实现
          // setError(response.message || '获取生命周期策略失败')
        }

      } catch (err) {
        console.error('获取生命周期策略失败:', err)
        setError('获取生命周期策略失败')
        setLifecyclePolicies([]) // 确保在错误时设置为空数组
      } finally {
        setLoading(prev => ({ ...prev, lifecycle: false }))
      }
    }

    fetchLifecyclePolicies()
  }, [])

  // 过滤存储桶
  const filteredBuckets = buckets.filter((bucket) => {
    const matchesSearch =
      bucket.name.toLowerCase().includes(searchBucket.toLowerCase()) ||
      bucket.id.toLowerCase().includes(searchBucket.toLowerCase())
    const matchesAccess =
      selectedBucketAccess === "all" || bucket.access.toLowerCase() === selectedBucketAccess.toLowerCase()
    return matchesSearch && matchesAccess
  })

  // 过滤对象
  const filteredObjects = objects.filter((object) => {
    const matchesSearch = object.key.toLowerCase().includes(searchObject.toLowerCase())
    const matchesBucket = selectedBucket === "all" || object.bucketName === selectedBucket
    return matchesSearch && matchesBucket
  })

  // 计算总存储容量和对象数量
  const totalSize = buckets.reduce((sum, bucket) => sum + bucket.size, 0)
  const totalObjects = buckets.reduce((sum, bucket) => sum + bucket.objectCount, 0)

  // 刷新数据
  const handleRefresh = () => {
    // 重新获取数据
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">对象存储管理</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            创建存储桶
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
                重试
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 存储概览卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">存储桶数量</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.buckets ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{buckets.length}</div>
                <p className="text-xs text-muted-foreground">
                  {buckets.filter((b) => b.access === "public").length} 个公开,{" "}
                  {buckets.filter((b) => b.access === "private").length} 个私有
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总存储容量</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.buckets ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalSize.toFixed(1)} GB</div>
                <p className="text-xs text-muted-foreground">{totalObjects} 个对象</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">公开存储</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.buckets ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {buckets
                    .filter((b) => b.access === "public")
                    .reduce((sum, b) => sum + b.size, 0)
                    .toFixed(1)}{" "}
                  GB
                </div>
                <p className="text-xs text-muted-foreground">
                  {buckets.filter((b) => b.access === "public").reduce((sum, b) => sum + b.objectCount, 0)} 个对象
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">私有存储</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.buckets ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {buckets
                    .filter((b) => b.access === "private")
                    .reduce((sum, b) => sum + b.size, 0)
                    .toFixed(1)}{" "}
                  GB
                </div>
                <p className="text-xs text-muted-foreground">
                  {buckets.filter((b) => b.access === "private").reduce((sum, b) => sum + b.objectCount, 0)} 个对象
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs defaultValue="buckets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="buckets">存储桶管理</TabsTrigger>
          <TabsTrigger value="objects">对象管理</TabsTrigger>
          <TabsTrigger value="lifecycle">生命周期策略</TabsTrigger>
        </TabsList>

        {/* 存储桶管理标签内容 */}
        <TabsContent value="buckets" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="搜索存储桶..."
                value={searchBucket}
                onChange={(e) => setSearchBucket(e.target.value)}
                className="w-[250px]"
              />
              <Select value={selectedBucketAccess} onValueChange={setSelectedBucketAccess}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="访问权限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有权限</SelectItem>
                  <SelectItem value="public">公开</SelectItem>
                  <SelectItem value="private">私有</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  创建存储桶
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>创建新存储桶</DialogTitle>
                  <DialogDescription>配置新对象存储桶的详细信息。创建后，您可以上传对象到此存储桶。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      名称
                    </Label>
                    <Input id="name" placeholder="存储桶名称" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="region" className="text-right">
                      区域
                    </Label>
                    <Select defaultValue="cn-east-1">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择区域" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cn-east-1">华东 1 (杭州)</SelectItem>
                        <SelectItem value="cn-north-1">华北 1 (北京)</SelectItem>
                        <SelectItem value="cn-south-1">华南 1 (广州)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="access" className="text-right">
                      访问权限
                    </Label>
                    <Select defaultValue="private">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择访问权限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">私有</SelectItem>
                        <SelectItem value="public">公开读取</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">创建存储桶</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>区域</TableHead>
                  <TableHead>访问权限</TableHead>
                  <TableHead>对象数量</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading.buckets ? (
                  // 加载状态
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-6 bg-muted rounded animate-pulse w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-8 bg-muted rounded animate-pulse w-8 ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : filteredBuckets.length === 0 ? (
                  // 空数据状态
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {buckets.length === 0 ? "暂无存储桶数据" : "没有匹配的存储桶"}
                        </p>
                        {buckets.length === 0 && (
                          <p className="text-xs text-muted-foreground">请等待后端API实现</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // 数据列表
                  filteredBuckets.map((bucket) => (
                    <TableRow key={bucket.id}>
                      <TableCell className="font-medium">{bucket.name}</TableCell>
                      <TableCell>{bucket.region}</TableCell>
                      <TableCell>
                        <Badge variant={accessColors[bucket.access] as any}>{bucket.access}</Badge>
                      </TableCell>
                      <TableCell>{bucket.objectCount}</TableCell>
                      <TableCell>{bucket.size.toFixed(1)} GB</TableCell>
                      <TableCell>{format(bucket.createdAt, "yyyy-MM-dd")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>详情</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Upload className="mr-2 h-4 w-4" />
                              <span>上传对象</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" />
                              <span>生成访问链接</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>删除</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 对象管理标签内容 */}
        <TabsContent value="objects" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="搜索对象..."
                value={searchObject}
                onChange={(e) => setSearchObject(e.target.value)}
                className="w-[250px]"
              />
              <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择存储桶" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有存储桶</SelectItem>
                  {buckets.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.name}>
                      {bucket.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              上传对象
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>键</TableHead>
                  <TableHead>存储桶</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>访问权限</TableHead>
                  <TableHead>最后修改</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading.objects ? (
                  // 加载状态
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`loading-object-${index}`}>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-6 bg-muted rounded animate-pulse w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse"></div></TableCell>
                      <TableCell><div className="h-8 bg-muted rounded animate-pulse w-8 ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : filteredObjects.length === 0 ? (
                  // 空数据状态
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {objects.length === 0 ? "暂无对象数据" : "没有匹配的对象"}
                        </p>
                        {objects.length === 0 && (
                          <p className="text-xs text-muted-foreground">请等待后端API实现</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // 数据列表
                  filteredObjects.map((object) => (
                    <TableRow key={object.key}>
                      <TableCell className="font-medium">{object.key}</TableCell>
                      <TableCell>{object.bucketName}</TableCell>
                      <TableCell>{object.type}</TableCell>
                      <TableCell>{object.size.toFixed(2)} GB</TableCell>
                      <TableCell>
                        <Badge variant={accessColors[object.access] as any}>{object.access}</Badge>
                      </TableCell>
                      <TableCell>{format(object.lastModified, "yyyy-MM-dd")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>下载</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="mr-2 h-4 w-4" />
                              <span>生成访问链接</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              <span>属性</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>删除</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 生命周期策略标签内容 */}
        <TabsContent value="lifecycle" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">生命周期策略</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              创建策略
            </Button>
          </div>

          {loading.lifecycle ? (
            // 加载状态
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={`loading-policy-${index}`}>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="h-8 bg-muted rounded animate-pulse w-16"></div>
                    <div className="h-8 bg-muted rounded animate-pulse w-16"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : !Array.isArray(lifecyclePolicies) || lifecyclePolicies.length === 0 ? (
            // 空数据状态
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">暂无生命周期策略</p>
                  <p className="text-xs text-muted-foreground mt-1">点击"创建策略"按钮开始配置</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // 策略列表
            <div className="grid gap-4 md:grid-cols-2">
              {(Array.isArray(lifecyclePolicies) ? lifecyclePolicies : []).map((policy) => (
                <Card key={policy.id}>
                  <CardHeader>
                    <CardTitle>{policy.name || '未命名策略'}</CardTitle>
                    <CardDescription>{policy.description || '无描述'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">应用存储桶:</span>
                        <span className="text-sm font-medium">{policy.bucketName || '未指定'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">对象前缀:</span>
                        <span className="text-sm font-medium">{policy.prefix || '无'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{policy.action === 'transition' ? '转换天数:' : '过期天数:'}</span>
                        <span className="text-sm font-medium">{policy.days || 0}天</span>
                      </div>
                      {policy.action === 'transition' && policy.targetStorageClass && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">目标存储类型:</span>
                          <span className="text-sm font-medium">
                            {policy.targetStorageClass === 'low-frequency' ? '低频访问' : policy.targetStorageClass}
                          </span>
                        </div>
                      )}
                      {policy.action === 'expiration' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">操作:</span>
                          <span className="text-sm font-medium">删除</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm">状态:</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Check className="h-3 w-3" /> {policy.enabled ? '已启用' : '已禁用'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      编辑
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      删除
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
