"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Database, Activity, HardDrive, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getDatabaseOverviewStats, getDatabaseTypesDistribution, getDatabaseStorageData } from "@/lib/api/database"

export default function DatabaseOverviewPage() {
  // 数据状态
  const [databaseStats, setDatabaseStats] = useState<any>(null)
  const [databaseTypes, setDatabaseTypes] = useState<any[]>([])
  const [storageData, setStorageData] = useState<any[]>([])
  const [loading, setLoading] = useState({
    stats: true,
    types: true,
    storage: true,
  })
  const [error, setError] = useState<string | null>(null)

  // 获取数据库概览统计信息
  useEffect(() => {
    const fetchDatabaseStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }))
        setError(null)

        const response = await getDatabaseOverviewStats()

        // 修复API响应处理逻辑
        const apiResponse = response.data as any;
        if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
          setDatabaseStats(apiResponse.data)
        } else {
          setError(apiResponse?.message || '获取数据库统计信息失败')
        }

      } catch (err) {
        console.error('获取数据库统计信息失败:', err)
        setError('获取数据库统计信息失败')
      } finally {
        setLoading(prev => ({ ...prev, stats: false }))
      }
    }

    fetchDatabaseStats()
  }, [])

  // 获取数据库类型分布数据
  useEffect(() => {
    const fetchDatabaseTypes = async () => {
      try {
        setLoading(prev => ({ ...prev, types: true }))
        setError(null)

        const response = await getDatabaseTypesDistribution()

        // 修复API响应处理逻辑
        const apiResponse = response.data as any;
        if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
          setDatabaseTypes(apiResponse.data)
        } else {
          setError(apiResponse?.message || '获取数据库类型分布失败')
        }

      } catch (err) {
        console.error('获取数据库类型分布失败:', err)
        setError('获取数据库类型分布失败')
      } finally {
        setLoading(prev => ({ ...prev, types: false }))
      }
    }

    fetchDatabaseTypes()
  }, [])

  // 获取数据库存储容量数据
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        setLoading(prev => ({ ...prev, storage: true }))
        setError(null)

        const response = await getDatabaseStorageData()

        // 修复API响应处理逻辑
        const apiResponse = response.data as any;
        if (apiResponse && (apiResponse.success === true || apiResponse.code === 200)) {
          setStorageData(apiResponse.data)
        } else {
          setError(apiResponse?.message || '获取数据库存储数据失败')
        }

      } catch (err) {
        console.error('获取数据库存储数据失败:', err)
        setError('获取数据库存储数据失败')
      } finally {
        setLoading(prev => ({ ...prev, storage: false }))
      }
    }

    fetchStorageData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">数据库管理</h1>
          <p className="text-muted-foreground">管理和监控所有数据库实例</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Database className="mr-2 h-4 w-4" />
            创建数据库
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
            <CardTitle className="text-sm font-medium">关系型数据库</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ) : databaseStats ? (
              <>
                <div className="text-2xl font-bold">{databaseStats.relational?.count || 0}</div>
                <p className="text-xs text-muted-foreground">容量: {databaseStats.relational?.totalSize || '0TB'}</p>
                <Badge variant="default" className="mt-2">{databaseStats.relational?.status || '未知'}</Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">时序数据库</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ) : databaseStats ? (
              <>
                <div className="text-2xl font-bold">{databaseStats.timeseries?.count || 0}</div>
                <p className="text-xs text-muted-foreground">容量: {databaseStats.timeseries?.totalSize || '0TB'}</p>
                <Badge variant="default" className="mt-2">{databaseStats.timeseries?.status || '未知'}</Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">地理空间数据库</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ) : databaseStats ? (
              <>
                <div className="text-2xl font-bold">{databaseStats.geospatial?.count || 0}</div>
                <p className="text-xs text-muted-foreground">容量: {databaseStats.geospatial?.totalSize || '0GB'}</p>
                <Badge variant="default" className="mt-2">{databaseStats.geospatial?.status || '未知'}</Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">向量数据库</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.stats ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ) : databaseStats ? (
              <>
                <div className="text-2xl font-bold">{databaseStats.vector?.count || 0}</div>
                <p className="text-xs text-muted-foreground">容量: {databaseStats.vector?.totalSize || '0TB'}</p>
                <Badge variant="default" className="mt-2">{databaseStats.vector?.status || '未知'}</Badge>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">无数据</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>数据库类型分布</CardTitle>
            <CardDescription>各类数据库占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading.types ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : databaseTypes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={databaseTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {databaseTypes.map((entry, index) => (
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
        <Card>
          <CardHeader>
            <CardTitle>存储容量对比</CardTitle>
            <CardDescription>各类数据库的存储使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading.storage ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : storageData.length > 0 ? (
                <ChartContainer
                  config={{
                    usage: {
                      label: "使用率 (%)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <BarChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="usage" fill="var(--color-usage)" />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  暂无数据
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}