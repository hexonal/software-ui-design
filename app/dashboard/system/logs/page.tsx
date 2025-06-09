"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Trash2, RefreshCw, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 导入 API
import * as systemApi from "@/lib/api/system"

// 日志级别类型
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

// 日志项接口
interface LogEntry {
    id: string
    timestamp: string
    level: LogLevel
    message: string
    details?: string
}

// 获取日志级别对应的图标和颜色
const getLogLevelIcon = (level: LogLevel) => {
    switch (level) {
        case 'INFO':
            return <Info className="h-4 w-4 text-blue-500" />
        case 'WARN':
            return <AlertTriangle className="h-4 w-4 text-yellow-500" />
        case 'ERROR':
            return <AlertCircle className="h-4 w-4 text-red-500" />
        case 'DEBUG':
            return <X className="h-4 w-4 text-gray-500" />
        default:
            return <Info className="h-4 w-4 text-gray-500" />
    }
}

// 获取日志级别对应的 Badge 样式
const getLogLevelBadge = (level: LogLevel) => {
    switch (level) {
        case 'INFO':
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800">{level}</Badge>
        case 'WARN':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{level}</Badge>
        case 'ERROR':
            return <Badge variant="destructive">{level}</Badge>
        case 'DEBUG':
            return <Badge variant="outline">{level}</Badge>
        default:
            return <Badge variant="secondary">{level}</Badge>
    }
}

export default function SystemLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [levelFilter, setLevelFilter] = useState<string>('all')
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

    // 初始化加载日志数据
    useEffect(() => {
        handleRefresh()
    }, [])

    // 筛选日志
    useEffect(() => {
        let filtered = logs

        // 按搜索词筛选
        if (searchTerm) {
            filtered = filtered.filter(log =>
                log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // 按级别筛选
        if (levelFilter !== 'all') {
            filtered = filtered.filter(log => log.level === levelFilter)
        }

        setFilteredLogs(filtered)
    }, [logs, searchTerm, levelFilter])

    // 刷新日志
    const handleRefresh = async () => {
        setLoading(true)
        try {
            // 调用真实的系统日志API
            const response = await systemApi.getSystemLogs({
                page: 1,
                size: 100,
                level: levelFilter !== 'all' ? levelFilter : undefined,
                search: searchTerm || undefined
            })

            // 适配统一响应体格式：{code: 200, message: "success", data: [...]}
            if (response.data && (response.data as any).code === 200 && Array.isArray((response.data as any).data)) {
                const apiLogs = (response.data as any).data.map((log: any, index: number) => ({
                    id: log.id || String(index + 1),
                    timestamp: log.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
                    level: (log.level || 'INFO').toUpperCase() as LogLevel,
                    message: log.message || '无消息',
                    details: log.details || log.stack || ''
                }))
                setLogs(apiLogs)
            } else {
                // API返回空数据或格式错误时，显示空列表
                setLogs([])
            }
        } catch (error) {
            console.error('刷新日志失败:', error)
            // API调用失败时，显示空列表
            setLogs([])
        } finally {
            setLoading(false)
        }
    }

    // 清空日志
    const handleClearLogs = () => {
        if (confirm('确定要清空所有日志吗？此操作不可撤销。')) {
            setLogs([])
            setFilteredLogs([])
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">系统日志</h1>
                <p className="text-muted-foreground">查看和管理系统运行日志</p>
            </div>

            {/* 统计信息 */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总日志数</CardTitle>
                        <Info className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? (
                                <div className="flex items-center space-x-1">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>--</span>
                                </div>
                            ) : (
                                logs.length
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">错误日志</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {loading ? (
                                <div className="flex items-center space-x-1">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>--</span>
                                </div>
                            ) : (
                                logs.filter(log => log.level === 'ERROR').length
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">警告日志</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {loading ? (
                                <div className="flex items-center space-x-1">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>--</span>
                                </div>
                            ) : (
                                logs.filter(log => log.level === 'WARN').length
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">信息日志</CardTitle>
                        <Info className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {loading ? (
                                <div className="flex items-center space-x-1">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    <span>--</span>
                                </div>
                            ) : (
                                logs.filter(log => log.level === 'INFO').length
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 操作栏 */}
            <Card>
                <CardHeader>
                    <CardTitle>日志筛选</CardTitle>
                    <CardDescription>使用以下选项筛选和搜索日志</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="search">搜索</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="搜索日志消息或组件..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="level-filter">日志级别</Label>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger id="level-filter" className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">全部</SelectItem>
                                    <SelectItem value="ERROR">错误</SelectItem>
                                    <SelectItem value="WARN">警告</SelectItem>
                                    <SelectItem value="INFO">信息</SelectItem>
                                    <SelectItem value="DEBUG">调试</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={handleRefresh} disabled={loading} variant="outline">
                                {loading ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                            </Button>
                            <Button onClick={handleClearLogs} variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                清空
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 日志表格 */}
            <Card>
                <CardHeader>
                    <CardTitle>日志列表</CardTitle>
                    <CardDescription>
                        显示 {filteredLogs.length} 条日志 {filteredLogs.length !== logs.length && `(共 ${logs.length} 条)`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-32">时间</TableHead>
                                    <TableHead className="w-20">级别</TableHead>
                                    <TableHead>消息</TableHead>
                                    <TableHead className="w-20">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                <span>加载中...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            没有找到符合条件的日志
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs">
                                                {log.timestamp}
                                            </TableCell>
                                            <TableCell>
                                                {getLogLevelBadge(log.level)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {getLogLevelIcon(log.level)}
                                                    <span className="truncate max-w-md">{log.message}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedLog(log)}
                                                >
                                                    详情
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* 日志详情弹窗 */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    {getLogLevelIcon(selectedLog.level)}
                                    <span>日志详情</span>
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedLog(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>时间</Label>
                                    <p className="font-mono text-sm">{selectedLog.timestamp}</p>
                                </div>
                                <div>
                                    <Label>级别</Label>
                                    <div className="mt-1">
                                        {getLogLevelBadge(selectedLog.level)}
                                    </div>
                                </div>
                                <div>
                                    <Label>ID</Label>
                                    <p className="font-mono text-xs text-muted-foreground">{selectedLog.id}</p>
                                </div>
                            </div>
                            <div>
                                <Label>消息</Label>
                                <p className="text-sm mt-1">{selectedLog.message}</p>
                            </div>
                            {selectedLog.details && (
                                <div>
                                    <Label>详细信息</Label>
                                    <pre className="text-xs bg-muted p-3 rounded-md mt-1 overflow-x-auto">
                                        {selectedLog.details}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
} 