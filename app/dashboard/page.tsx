"use client"

import { useState, useEffect } from "react"
import { Activity, Database, HardDrive, Server } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { SystemHealthChart } from "@/components/dashboard/system-health-chart"
import { StatusCard } from "@/components/dashboard/status-card"
import { NavigationCard } from "@/components/dashboard/navigation-card"

// 修正API导入
import { systemApi } from "@/lib/api"
import type { SystemStatusResponse } from "@/lib/api/types"

export default function DashboardPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse>({
    health: { value: "-", description: "加载中", status: "default" },
    storage: { value: "-", description: "加载中", status: "default" },
    nodes: { value: "-", description: "加载中", status: "default" },
    databases: { value: "-", description: "加载中", status: "default" }
  })

  useEffect(() => {
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

    fetchStatus()
  }, [])

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

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>系统健康状态</CardTitle>
            <CardDescription>过去 30 天的系统健康状态趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemHealthChart />
          </CardContent>
        </Card>
      </div>

      {/* Navigation section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavigationCard
          title="集群管理"
          description="监控和管理分布式集群节点"
          icon={Server}
          href="/dashboard/cluster/nodes"
        />
        <NavigationCard
          title="数据库管理"
          description="管理关系型、时序、地理空间等数据库"
          icon={Database}
          href="/dashboard/database/relational"
        />
        <NavigationCard
          title="存储管理"
          description="管理文件存储和对象存储"
          icon={HardDrive}
          href="/dashboard/storage/file"
        />
      </div>
    </div>
  )
}