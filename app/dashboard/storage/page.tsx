"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { HardDrive, FolderTree, Package, HardDriveIcon as HardDisk, Server } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function StorageOverviewPage() {
  // 数据状态
  const [storageStats, setStorageStats] = useState<any>(null)
  const [storageTypes, setStorageTypes] = useState<any[]>([])
  const [storageNodes, setStorageNodes] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [loading, setLoading] = useState({
    stats: true,
    types: true,
    nodes: true,
    performance: true,
  })
  const [error, setError] = useState<string | null>(null)

  // 获取存储概览统计信息
  useEffect(() => {
    const fetchStorageStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }))
        setError(null)

        const { getStorageOverviewStats } = await import('@/lib/api/storage')
        const response = await getStorageOverviewStats()
        if (response.success) {
          setStorageStats(response.data)
        } else {
          setError(response.message || '获取存储统计信息失败')
        }

      } catch (err) {
        console.error('获取存储统计信息失败:', err)
        setError('获取存储统计信息失败')
      } finally {
        setLoading(prev => ({ ...prev, stats: false }))
      }
    }

    fetchStorageStats()
  }, [])

  // 获取存储类型分布数据
  useEffect(() => {
    const fetchStorageTypes = async () => {
      try {
        setLoading(prev => ({ ...prev, types: true }))
        setError(null)

        const { getStorageTypesDistribution } = await import('@/lib/api/storage')
        const response = await getStorageTypesDistribution()
        if (response.success) {
          setStorageTypes(response.data)
        } else {
          setError(response.message || '获取存储类型分布失败')
        }

      } catch (err) {
        console.error('获取存储类型分布失败:', err)
        setError('获取存储类型分布失败')
      } finally {
        setLoading(prev => ({ ...prev, types: false }))
      }
    }

    fetchStorageTypes()
  }, [])

  // 获取存储节点状态列表
  useEffect(() => {
    const fetchStorageNodes = async () => {
      try {
        setLoading(prev => ({ ...prev, nodes: true }))
        setError(null)

        const { getStorageNodes } = await import('@/lib/api/storage')
        const response = await getStorageNodes()
        if (response.success) {
          setStorageNodes(response.data)
        } else {
          setError(response.message || '获取存储节点列表失败')
        }

      } catch (err) {
        console.error('获取存储节点列表失败:', err)
        setError('获取存储节点列表失败')
      } finally {
        setLoading(prev => ({ ...prev, nodes: false }))
      }
    }

    fetchStorageNodes()
  }, [])

  // 获取存储性能数据
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(prev => ({ ...prev, performance: true }))
        setError(null)

        const { getStoragePerformanceData } = await import('@/lib/api/storage')
        const response = await getStoragePerformanceData()
        if (response.success) {
          setPerformanceData(response.data)
        } else {
          setError(response.message || '获取存储性能数据失败')
        }

      } catch (err) {
        console.error('获取存储性能数据失败:', err)
        setError('获取存储性能数据失败')
      } finally {
        setLoading(prev => ({ ...prev, performance: false }))
      }
    }

    fetchPerformanceData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">存储管理</h1>
          <p className="text-muted-foreground">管理和监控所有存储资源</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <HardDrive className="mr-2 h-4 w-4" />
            添加存储
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">文件存储</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ) : storageStats ? (
              <>
                <div className="text-2xl font-bold">{storageStats.fileStorage?.used || '0TB'}</div>
                <p className="text-xs text-muted-foreground">已使用 {storageStats.fileStorage?.usagePercent || 0}%</p>
                <Progress value={storageStats.fileStorage?.usagePercent || 0} className="mt-2" />
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">对象存储</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ) : storageStats ? (
              <>
                <div className="text-2xl font-bold">{storageStats.objectStorage?.used || '0TB'}</div>
                <p className="text-xs text-muted-foreground">已使用 {storageStats.objectStorage?.usagePercent || 0}%</p>
                <Progress value={storageStats.objectStorage?.usagePercent || 0} className="mt-2" />
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">块存储</CardTitle>
            <HardDisk className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ) : storageStats ? (
              <>
                <div className="text-2xl font-bold">{storageStats.blockStorage?.used || '0TB'}</div>
                <p className="text-xs text-muted-foreground">已使用 {storageStats.blockStorage?.usagePercent || 0}%</p>
                <Progress value={storageStats.blockStorage?.usagePercent || 0} className="mt-2" />
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">存储节点</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ) : storageStats ? (
              <>
                <div className="text-2xl font-bold">{storageStats.nodes?.online || 0}/{storageStats.nodes?.total || 0}</div>
                <p className="text-xs text-muted-foreground">{storageStats.nodes?.online || 0} 个节点在线</p>
                <Progress value={storageStats.nodes?.onlinePercent || 0} className="mt-2" />
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>存储类型分布</CardTitle>
            <CardDescription>各类存储容量占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading.types ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : storageTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={storageTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {storageTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  暂无数据
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>存储性能指标</CardTitle>
            <CardDescription>过去 24 小时的性能数据</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="iops">
              <TabsList className="mb-4">
                <TabsTrigger value="iops">IOPS</TabsTrigger>
                <TabsTrigger value="throughput">吞吐量</TabsTrigger>
                <TabsTrigger value="latency">延迟</TabsTrigger>
              </TabsList>
              <TabsContent value="iops" className="h-64">
                {loading.performance ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : performanceData.length > 0 ? (
                  <ChartContainer
                    config={{
                      iops: {
                        label: "IOPS",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="iops" stroke="var(--color-iops)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    暂无数据
                  </div>
                )}
              </TabsContent>
              <TabsContent value="throughput" className="h-64">
                {loading.performance ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : performanceData.length > 0 ? (
                  <ChartContainer
                    config={{
                      throughput: {
                        label: "吞吐量 (MB/s)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="throughput" stroke="var(--color-throughput)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    暂无数据
                  </div>
                )}
              </TabsContent>
              <TabsContent value="latency" className="h-64">
                {loading.performance ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : performanceData.length > 0 ? (
                  <ChartContainer
                    config={{
                      latency: {
                        label: "延迟 (ms)",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="latency" stroke="var(--color-latency)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    暂无数据
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>存储节点状态</CardTitle>
          <CardDescription>所有存储节点的状态和使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.nodes ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : storageNodes.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-6 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                <div>ID</div>
                <div>名称</div>
                <div>类型</div>
                <div>状态</div>
                <div>使用率</div>
                <div className="text-right">操作</div>
              </div>
              <div className="divide-y">
                {storageNodes.map((node) => (
                  <div key={node.id} className="grid grid-cols-6 items-center px-4 py-3 text-sm">
                    <div className="font-medium">{node.id}</div>
                    <div>{node.name}</div>
                    <div>{node.type}</div>
                    <div>
                      <Badge variant={node.status === "在线" ? "default" : "destructive"}>{node.status}</Badge>
                    </div>
                    <div>
                      {node.status === "在线" ? (
                        <div className="flex items-center gap-2">
                          <Progress value={node.usage} className="h-2 flex-1" />
                          <span className="text-xs">{node.usage}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">不可用</span>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        查看
                      </Button>
                      <Button variant="ghost" size="sm">
                        管理
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              暂无存储节点数据
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
