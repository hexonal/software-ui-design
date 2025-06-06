"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SystemHealthData {
  name: string
  cpu: number
  memory: number
  disk: number
  network: number
}

export function SystemHealthChart() {
  const [data, setData] = useState<SystemHealthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystemHealthData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 调用实际的API
        const { getHealthMetrics } = await import('@/lib/api/system')
        const response = await getHealthMetrics({ timeRange: '30d' })
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message || '获取系统健康数据失败')
        }

      } catch (err) {
        console.error('获取系统健康数据失败:', err)
        setError('获取系统健康数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchSystemHealthData()
  }, [])

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-1">请稍后重试</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">暂无系统健康数据</p>
          <p className="text-xs text-muted-foreground mt-1">请等待后端API实现</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU 使用率" />
          <Line type="monotone" dataKey="memory" stroke="#10b981" name="内存使用率" />
          <Line type="monotone" dataKey="disk" stroke="#f59e0b" name="磁盘使用率" />
          <Line type="monotone" dataKey="network" stroke="#8b5cf6" name="网络使用率" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
