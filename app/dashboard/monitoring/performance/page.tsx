"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  Activity,
  Server,
  HardDrive,
  Network,
  RefreshCw,
  AlertTriangle,

  Download,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// 导入 API
import { monitoringApi } from "@/api"

export default function PerformanceMonitoringPage() {
  const [timeRange, setTimeRange] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)



  // 获取性能数据
  useEffect(() => {
    fetchPerformanceData()
  }, [timeRange])

  const fetchPerformanceData = async () => {
    // 设置超时定时器（50秒）
    const timeoutId = setTimeout(() => {
      setError('请求超时：获取性能数据超过50秒，请检查网络连接或服务状态')
      setLoading(false)
      setIsRefreshing(false)
    }, 50000) // 50秒超时

    try {
      setLoading(true)
      setError(null)
      setIsRefreshing(true)
      console.log('开始加载状态，设置loading为true')

      console.log('开始获取性能数据，时间范围:', timeRange)
      console.log('调用 monitoringApi.getPerformanceData:', monitoringApi.getPerformanceData)

      const response = await monitoringApi.getPerformanceData(timeRange)

      console.log('===== 性能数据详细调试信息 =====')
      console.log('原始API响应:', response)
      console.log('响应对象类型:', typeof response)
      console.log('响应是否为null:', response === null)
      console.log('响应是否为undefined:', response === undefined)
      console.log('响应原型:', Object.getPrototypeOf(response))
      console.log('响应构造函数:', response?.constructor?.name)
      console.log('响应类型检查:', {
        responseType: typeof response,
        isObject: typeof response === 'object',
        hasSuccess: response && 'success' in response,
        hasData: response && 'data' in response,
        hasMessage: response && 'message' in response,
        hasCode: response && 'code' in response,
        successValue: response?.success,
        dataValue: response?.data,
        messageValue: response?.message,
        codeValue: response?.code
      })

      // 增强的响应处理逻辑
      let finalData = null
      let isSuccess = false
      let errorMessage = "获取性能数据失败"

      // 情况1: 标准Result结构 (response.success存在)
      if (response && typeof response === 'object' && 'success' in response) {
        isSuccess = Boolean(response.success)
        finalData = response.data
        errorMessage = response.message || errorMessage
        console.log('检测到标准Result结构:', { isSuccess, finalData, errorMessage })
      }
      // 情况2: 直接返回数据 (没有success字段，但有数据)
      else if (response && typeof response === 'object') {
        // 检查是否有code字段判断成功
        if ('code' in response) {
          isSuccess = response.code === 200
          finalData = response.data || response
          errorMessage = response.message || errorMessage
          console.log('检测到带code的响应:', { isSuccess, finalData, errorMessage })
        } else {
          // 假设直接返回的对象就是数据
          isSuccess = true
          finalData = response
          console.log('检测到直接对象响应:', { finalData })
        }
      }
      // 情况3: 数组数据
      else if (Array.isArray(response)) {
        isSuccess = true
        finalData = response
        console.log('检测到数组响应:', { finalData })
      }
      // 情况4: 基础类型数据
      else if (response !== null && response !== undefined) {
        isSuccess = true
        finalData = response
        console.log('检测到基础类型响应:', { finalData })
      }

      if (isSuccess && finalData !== null && finalData !== undefined) {
        console.log('===== 成功处理性能数据 =====')
        console.log('最终数据:', finalData)

        // 额外检查：如果 finalData 是 axios 响应对象，需要进一步解析
        let extractedData = finalData
        if (finalData && typeof finalData === 'object' && 'data' in finalData && 'status' in finalData) {
          console.log('检测到 axios 响应对象，进行数据提取')
          console.log('响应对象的 data 字段:', finalData.data)

          // 这是一个 axios 响应对象，需要提取数据
          if (finalData.data && typeof finalData.data === 'object') {
            if ('data' in finalData.data) {
              // 嵌套的 data 结构：response.data.data
              extractedData = finalData.data.data
              console.log('提取的嵌套数据:', extractedData)
            } else {
              // 直接的 data 结构：response.data
              extractedData = finalData.data
              console.log('提取的直接数据:', extractedData)
            }
          }
        }

        console.log('数据详细结构:', {
          hasCpu: extractedData?.cpu,
          hasMemory: extractedData?.memory,
          hasDisk: extractedData?.disk,
          hasNetwork: extractedData?.network,
          cpuCurrent: extractedData?.cpu?.current,
          memoryCurrent: extractedData?.memory?.current,
          diskCurrent: extractedData?.disk?.current,
          networkCurrent: extractedData?.network?.current
        })
        console.log('设置 performanceData 为:', extractedData)
        console.log('数据加载完成，清除超时定时器')
        clearTimeout(timeoutId) // 清除超时定时器
        setPerformanceData(extractedData)
        setError(null)
      } else {
        console.error('获取性能数据失败:', {
          isSuccess,
          finalData,
          errorMessage,
          originalResponse: response
        })
        clearTimeout(timeoutId) // 清除超时定时器
        setError(errorMessage)
        setPerformanceData(null)
      }
    } catch (err: any) {
      console.error("获取性能数据异常:", err)
      console.error("异常详情:", {
        message: err?.message,
        response: err?.response,
        status: err?.response?.status,
        data: err?.response?.data
      })

      // 尝试从异常中提取有用信息
      let errorMsg = "获取性能数据失败"
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err?.message) {
        errorMsg = err.message
      }

      clearTimeout(timeoutId) // 清除超时定时器
      setError(errorMsg)
      setPerformanceData(null)
    } finally {
      console.log('API请求完成，设置loading为false')
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchPerformanceData()
  }

  // 导出性能数据为CSV
  const handleExportData = () => {
    if (!performanceData) return

    try {
      // 根据当前活动标签选择要导出的数据
      let dataToExport: any[] = []
      let filename = ""

      // 现在只有系统性能数据
      dataToExport = performanceData.systemData || performanceData
      filename = "system-performance"

      if (dataToExport.length === 0) {
        setError("没有可导出的数据")
        return
      }

      // 获取所有可能的列
      const allKeys = new Set<string>()
      dataToExport.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key))
      })

      // 创建CSV内容
      const headers = Array.from(allKeys).join(',')
      const rows = dataToExport.map(item =>
        Array.from(allKeys).map(key =>
          item[key] !== undefined ? `"${item[key]}"` : '""'
        ).join(',')
      ).join('\n')

      const csvContent = `${headers}\n${rows}`

      // 创建下载链接
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (err) {
      console.error("导出数据出错:", err)
      setError("导出数据失败")
    }
  }

  // 保存性能快照
  const handleSaveSnapshot = () => {
    if (!performanceData) return

    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        timeRange,
        data: performanceData
      }

      // 获取现有快照
      const existingSnapshots = JSON.parse(localStorage.getItem('performanceSnapshots') || '[]')

      // 添加新快照
      existingSnapshots.unshift(snapshot)

      // 限制保存的快照数量
      if (existingSnapshots.length > 10) {
        existingSnapshots.pop()
      }

      // 保存回本地存储
      localStorage.setItem('performanceSnapshots', JSON.stringify(existingSnapshots))

      alert('性能快照已保存')
    } catch (err) {
      console.error("保存快照出错:", err)
      setError("保存快照失败")
    }
  }

  // 辅助函数：比较当前值与昨日值
  const compareValues = (current: number, yesterday: number): string => {
    if (current === undefined || yesterday === undefined) return "N/A"
    const diff = current - yesterday
    return diff >= 0 ? `+${diff}%` : `${diff}%`
  }

  // 辅助函数：格式化时间范围
  const formatTimeRange = (range: string): string => {
    switch (range) {
      case "1h": return "1 小时"
      case "6h": return "6 小时"
      case "24h": return "24 小时"
      case "7d": return "7 天"
      case "30d": return "30 天"
      default: return range
    }
  }





  // 渲染时调试信息
  console.log('===== 渲染时状态检查 =====')
  console.log('performanceData状态:', performanceData)
  console.log('loading状态:', loading)
  console.log('error状态:', error)
  console.log('CPU当前值用于渲染:', performanceData?.cpu?.current)

  // 如果正在加载或者没有数据，显示加载状态
  if (loading || !performanceData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">性能监控</h1>
            <p className="text-muted-foreground">监控系统性能指标和资源使用情况</p>
          </div>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mb-2">正在加载性能数据...</p>
            <p className="text-xs text-muted-foreground">
              {loading ? '请等待，最长加载时间50秒' : '等待数据返回'}
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <Button
                  onClick={fetchPerformanceData}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  重新加载
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">性能监控</h1>
          <p className="text-muted-foreground">监控系统性能指标和资源使用情况</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">最近 1 小时</SelectItem>
              <SelectItem value="6h">最近 6 小时</SelectItem>
              <SelectItem value="24h">最近 24 小时</SelectItem>
              <SelectItem value="7d">最近 7 天</SelectItem>
              <SelectItem value="30d">最近 30 天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="sr-only">刷新</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportData} disabled={!performanceData}>
            <Download className="h-4 w-4" />
            <span className="sr-only">导出</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleSaveSnapshot} disabled={!performanceData}>
            <Save className="h-4 w-4" />
            <span className="sr-only">保存快照</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU 使用率</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.cpu?.current || 0}%</div>
            <p className="text-xs text-muted-foreground">
              较昨日 {compareValues(performanceData?.cpu?.current, performanceData?.cpu?.yesterday)}
            </p>
            <Progress
              value={performanceData?.cpu?.current || 0}
              className="mt-2"
              indicatorClassName={
                (performanceData?.cpu?.current || 0) > 80 ? "bg-red-500" :
                  (performanceData?.cpu?.current || 0) > 60 ? "bg-amber-500" :
                    "bg-green-500"
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">内存使用率</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.memory?.current || 0}%</div>
            <p className="text-xs text-muted-foreground">
              较昨日 {compareValues(performanceData?.memory?.current, performanceData?.memory?.yesterday)}
            </p>
            <Progress
              value={performanceData?.memory?.current || 0}
              className="mt-2"
              indicatorClassName={
                (performanceData?.memory?.current || 0) > 80 ? "bg-red-500" :
                  (performanceData?.memory?.current || 0) > 60 ? "bg-amber-500" :
                    "bg-green-500"
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">磁盘 I/O</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.disk?.current || 0} IOPS</div>
            <p className="text-xs text-muted-foreground">
              {performanceData?.disk?.current || 0} MB/s 吞吐量
            </p>
            <Progress
              value={performanceData?.disk?.current || 0}
              className="mt-2"
              indicatorClassName={
                (performanceData?.disk?.current || 0) > 80 ? "bg-red-500" :
                  (performanceData?.disk?.current || 0) > 60 ? "bg-amber-500" :
                    "bg-green-500"
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">网络吞吐量</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.network?.current || 0} Mbps</div>
            <p className="text-xs text-muted-foreground">
              {performanceData?.network?.current || 0} 包/秒
            </p>
            <Progress
              value={performanceData?.network?.current || 0}
              className="mt-2"
              indicatorClassName={
                (performanceData?.network?.current || 0) > 80 ? "bg-red-500" :
                  (performanceData?.network?.current || 0) > 60 ? "bg-amber-500" :
                    "bg-green-500"
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>系统资源使用趋势</CardTitle>
          <CardDescription>过去 {formatTimeRange(timeRange)} 的系统资源使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData?.systemData || [
                  {
                    time: '00:00',
                    cpu: performanceData?.cpu?.current || 0,
                    memory: performanceData?.memory?.current || 0,
                    disk: performanceData?.disk?.current || 0,
                    network: performanceData?.network?.current || 0,
                  }
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU 使用率 (%)" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" name="内存使用率 (%)" />
                <Line type="monotone" dataKey="disk" stroke="#f59e0b" name="磁盘使用率 (%)" />
                <Line type="monotone" dataKey="network" stroke="#8b5cf6" name="网络使用率 (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>系统资源使用详情</CardTitle>
          <CardDescription>各项系统资源的使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>资源</TableHead>
                <TableHead>当前使用率</TableHead>
                <TableHead>平均使用率</TableHead>
                <TableHead>峰值使用率</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">CPU</TableCell>
                <TableCell>{performanceData?.cpu?.current || 0}%</TableCell>
                <TableCell>{performanceData?.cpu?.average || 0}%</TableCell>
                <TableCell>{performanceData?.cpu?.peak || 0}%</TableCell>
                <TableCell>
                  <Badge variant={
                    (performanceData?.cpu?.current || 0) > 80 ? "destructive" :
                      (performanceData?.cpu?.current || 0) > 60 ? "outline" :
                        "default"
                  }>
                    {(performanceData?.cpu?.current || 0) > 80 ? "高负载" :
                      (performanceData?.cpu?.current || 0) > 60 ? "中负载" :
                        "正常"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">内存</TableCell>
                <TableCell>{performanceData?.memory?.current || 0}%</TableCell>
                <TableCell>{performanceData?.memory?.average || 0}%</TableCell>
                <TableCell>{performanceData?.memory?.peak || 0}%</TableCell>
                <TableCell>
                  <Badge variant={
                    (performanceData?.memory?.current || 0) > 80 ? "destructive" :
                      (performanceData?.memory?.current || 0) > 60 ? "outline" :
                        "default"
                  }>
                    {(performanceData?.memory?.current || 0) > 80 ? "高负载" :
                      (performanceData?.memory?.current || 0) > 60 ? "中负载" :
                        "正常"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">磁盘</TableCell>
                <TableCell>{performanceData?.disk?.current || 0}%</TableCell>
                <TableCell>{performanceData?.disk?.average || 0}%</TableCell>
                <TableCell>{performanceData?.disk?.peak || 0}%</TableCell>
                <TableCell>
                  <Badge variant={
                    (performanceData?.disk?.current || 0) > 80 ? "destructive" :
                      (performanceData?.disk?.current || 0) > 60 ? "outline" :
                        "default"
                  }>
                    {(performanceData?.disk?.current || 0) > 80 ? "高负载" :
                      (performanceData?.disk?.current || 0) > 60 ? "中负载" :
                        "正常"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">网络</TableCell>
                <TableCell>{performanceData?.network?.current || 0}%</TableCell>
                <TableCell>{performanceData?.network?.average || 0}%</TableCell>
                <TableCell>{performanceData?.network?.peak || 0}%</TableCell>
                <TableCell>
                  <Badge variant={
                    (performanceData?.network?.current || 0) > 80 ? "destructive" :
                      (performanceData?.network?.current || 0) > 60 ? "outline" :
                        "default"
                  }>
                    {(performanceData?.network?.current || 0) > 80 ? "高负载" :
                      (performanceData?.network?.current || 0) > 60 ? "中负载" :
                        "正常"}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}