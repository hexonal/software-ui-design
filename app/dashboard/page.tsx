"use client"

import { useState, useEffect } from "react"
import { Activity, Database, HardDrive, AlertTriangle, Server, FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { SystemHealthChart } from "@/components/dashboard/system-health-chart"
import { StatusCard } from "@/components/dashboard/status-card"
import { NavigationCard } from "@/components/dashboard/navigation-card"

// 修正API导入
import { systemApi } from "@/lib/api"
import type { ApiResponse, SystemStatusResponse, StatusItem } from "@/lib/api/types"

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse>({
    health: { value: "-", description: "加载中", status: "default" },
    storage: { value: "-", description: "加载中", status: "default" },
    nodes: { value: "-", description: "加载中", status: "default" },
    databases: { value: "-", description: "加载中", status: "default" }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        console.log('开始获取告警数据...')
        const response = await systemApi.getSystemAlerts()
        console.log('告警API响应:', response)

        // TestController的alerts接口直接返回JSON数组，通过响应拦截器包装
        const apiResponse = response as any
        const data = apiResponse.data as ApiResponse<any[]>

        console.log('告警数据解析:', {
          hasData: !!data,
          success: data?.success,
          code: data?.code,
          dataType: typeof data?.data,
          dataLength: Array.isArray(data?.data) ? data.data.length : 'not array',
          data: data?.data
        })

        // 处理两种可能的数据格式
        let alertsData: any[] = []
        if (data && data.success && Array.isArray(data.data)) {
          // 标准包装格式
          alertsData = data.data
        } else if (Array.isArray(data?.data)) {
          // 直接数组格式
          alertsData = data.data
        } else if (Array.isArray(data)) {
          // 完全直接的数组格式
          alertsData = data
        }

        setAlerts(alertsData)
        console.log('告警数据设置成功:', alertsData)

        if (alertsData.length === 0) {
          console.warn('未获取到告警数据')
        }
      } catch (err: any) {
        console.error('获取告警数据异常:', err)
        setError(err.message || '获取告警数据失败')
      } finally {
        setLoading(false)
      }
    }

    const fetchStatus = async () => {
      try {
        console.log('开始获取系统状态...')
        const response = await systemApi.getSystemStatus()
        console.log('系统状态API原始响应:', response)
        console.log('响应类型:', typeof response)
        console.log('响应结构检查:', {
          hasCode: 'code' in response,
          hasData: 'data' in response,
          hasSuccess: 'success' in response,
          code: response.code,
          success: response.success,
          dataType: typeof response.data,
          data: response.data
        })

        // 处理双重包装的响应数据
        const apiResponse = response as any

        // 检查是否是双重包装 - 外层没有success，内层data中有完整的Result结构
        let actualData: SystemStatusResponse | null = null

        if (apiResponse.data &&
          typeof apiResponse.data === 'object' &&
          apiResponse.data.code === 200 &&
          apiResponse.data.data) {
          // 双重包装：外层是axios响应，内层是Result结构
          actualData = apiResponse.data.data as SystemStatusResponse
          console.log('检测到双重包装，提取内层数据:', actualData)
        } else if (apiResponse.data &&
          apiResponse.data.health &&
          apiResponse.data.storage) {
          // 直接的数据格式
          actualData = apiResponse.data as SystemStatusResponse
          console.log('使用直接数据格式:', actualData)
        }

        if (actualData) {
          setSystemStatus(actualData)
          console.log('系统状态设置成功!', actualData)
        } else {
          console.error('无法提取系统状态数据，响应结构:', {
            hasData: !!apiResponse.data,
            dataType: typeof apiResponse.data,
            dataKeys: apiResponse.data ? Object.keys(apiResponse.data) : [],
            fullResponse: apiResponse
          })
        }
      } catch (err: any) {
        console.error('获取系统状态异常:', err)
        // 保持默认状态，不设置错误信息，因为这不是关键错误
      }
    }

    fetchAlerts()
    fetchStatus()
  }, [])

  // Get the 5 most recent alerts
  const recentAlerts = alerts.slice(0, 5)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="系统健康状态"
          value={systemStatus.health.value}
          description={systemStatus.health.description}
          icon={Activity}
          status={systemStatus.health.status}
        />
        <StatusCard
          title="存储使用量"
          value={systemStatus.storage.value}
          description={systemStatus.storage.description}
          icon={HardDrive}
          status={systemStatus.storage.status}
        />
        <StatusCard
          title="节点状态"
          value={systemStatus.nodes.value}
          description={systemStatus.nodes.description}
          icon={Server}
          status={systemStatus.nodes.status}
        />
        <StatusCard
          title="数据库"
          value={systemStatus.databases.value}
          description={systemStatus.databases.description}
          icon={Database}
          status={systemStatus.databases.status}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>系统健康状态</CardTitle>
            <CardDescription>过去 30 天的系统健康状态趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemHealthChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>系统告警摘要</CardTitle>
            <CardDescription>最近 5 条重要告警</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : recentAlerts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">暂无告警</p>
              </div>
            ) : (
              recentAlerts.map((alert) => {
                let IconComponent = FileText;
                let variant: "default" | "destructive" | undefined = "default";

                if (alert.severity === "critical") {
                  IconComponent = AlertTriangle;
                  variant = "destructive";
                } else if (alert.severity === "high") {
                  IconComponent = AlertTriangle;
                  variant = "destructive";
                } else if (alert.severity === "medium") {
                  IconComponent = Activity;
                }

                return (
                  <Alert key={alert.id} variant={variant}>
                    <IconComponent className="h-4 w-4" />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NavigationCard
          title="数据库管理"
          description="管理关系型、时序、向量和地理空间数据库"
          icon={Database}
          href="/dashboard/database"
        />
        <NavigationCard
          title="存储管理"
          description="管理文件、对象和块存储"
          icon={HardDrive}
          href="/dashboard/storage"
        />
        <NavigationCard
          title="系统管理"
          description="系统设置、日志管理和扩容管理"
          icon={Server}
          href="/dashboard/system"
        />
      </div>
    </div>
  )
}