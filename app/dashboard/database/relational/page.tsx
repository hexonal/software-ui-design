"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Database,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Download,
  AlertTriangle,
  FileText,
  Plus,
  Trash2,
  RefreshCw,
  Save
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// 导入 API
import { databaseApi, relationalApi } from "@/api"

export default function RelationalDatabasePage() {
  const [activeTab, setActiveTab] = useState("databases")
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users LIMIT 10;")
  const [queryResult, setQueryResult] = useState<any>(null)
  const [selectedDatabase, setSelectedDatabase] = useState("postgres-main")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [databases, setDatabases] = useState<any[]>([])
  const [loadingDatabases, setLoadingDatabases] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isCreateDatabaseOpen, setIsCreateDatabaseOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [databaseToDelete, setDatabaseToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isExecutingQuery, setIsExecutingQuery] = useState(false)
  const [newDatabaseData, setNewDatabaseData] = useState({
    name: "",
    charset: "UTF-8",
    collation: "en_US.UTF-8"
  })

  // 获取数据库列表
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setLoadingDatabases(true)
        setInitialLoading(true)
        setLoadingProgress(0)

        // 模拟长时间加载过程，显示进度
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + Math.random() * 15
          })
        }, 2000)

        console.log("开始获取数据库列表...")
        const response = await relationalApi.getRelationalDatabases()
        console.log("API响应:", response)
        console.log("响应数据结构检查:", {
          hasData: !!response.data,
          dataType: typeof response.data,
          dataKeys: response.data ? Object.keys(response.data) : [],
          hasSuccess: response.data && 'success' in response.data,
          successValue: response.data && typeof response.data === 'object' && 'success' in response.data ? (response.data as any).success : undefined,
          hasCode: response.data && 'code' in response.data,
          codeValue: response.data && typeof response.data === 'object' && 'code' in response.data ? (response.data as any).code : undefined,
          hasDataField: response.data && 'data' in response.data,
          dataFieldValue: response.data && typeof response.data === 'object' && 'data' in response.data ? (response.data as any).data : undefined
        })

        // 清除进度条间隔
        clearInterval(progressInterval)
        setLoadingProgress(100)

        // 响应拦截器处理后，数据在response.data中，而实际业务数据在response.data.data中
        const apiResponse = response.data as any; // 这是经过响应拦截器处理的{code, message, data, success}格式
        if (apiResponse && apiResponse.success === true) {
          console.log("API调用成功，数据库列表:", apiResponse.data)
          const databases = apiResponse.data || []
          setDatabases(databases)
          if (databases.length > 0) {
            setSelectedDatabase(databases[0].id)
          }
        } else {
          console.error("API响应表示失败:", apiResponse)
          setError(apiResponse?.message || "获取数据库列表失败")
        }
      } catch (err) {
        console.error("获取数据库列表出错:", err)
        setError(`获取数据库列表时发生错误: ${err instanceof Error ? err.message : '未知错误'}`)
      } finally {
        // 延迟一秒让用户看到100%完成状态
        setTimeout(() => {
          setLoadingDatabases(false)
          setInitialLoading(false)
          setLoadingProgress(0)
        }, 1000)
      }
    }

    fetchDatabases()
  }, [])

  const handleExecuteQuery = async () => {
    if (!selectedDatabase) {
      setError("请先选择数据库")
      return
    }

    if (!sqlQuery.trim()) {
      setError("查询语句不能为空")
      return
    }

    try {
      setIsExecutingQuery(true)
      setError(null)

      console.log("开始执行SQL查询:", { selectedDatabase, sqlQuery })

      // 使用 API 执行查询
      const response = await relationalApi.executeSQLQuery(selectedDatabase, sqlQuery)

      console.log("SQL查询API原始响应:", response)
      console.log("响应数据结构检查:", {
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        hasSuccess: response.data && 'success' in response.data,
        successValue: response.data && typeof response.data === 'object' && 'success' in response.data ? (response.data as any).success : undefined
      })

      // 响应拦截器处理后，数据在response.data中
      const apiResponse = response.data as any;
      console.log("SQL查询业务数据:", apiResponse)

      // 使用更宽松的成功判断逻辑，与其他页面保持一致
      if (apiResponse && (apiResponse.success === true || apiResponse.success === "true" || apiResponse.code === 200)) {
        let queryData = apiResponse.data;

        // 如果data字段不存在，尝试使用apiResponse本身作为数据
        if (!queryData && apiResponse.columns && apiResponse.rows) {
          queryData = apiResponse;
        }

        console.log("查询结果数据:", queryData)
        console.log("查询结果数据结构:", {
          dataType: typeof queryData,
          hasColumns: queryData && 'columns' in queryData,
          hasRows: queryData && 'rows' in queryData,
          columnsValue: queryData?.columns,
          rowsCount: queryData?.rows?.length,
          rowsValue: queryData?.rows
        })

        // 验证查询结果数据结构
        if (queryData && queryData.columns && Array.isArray(queryData.columns) && queryData.rows && Array.isArray(queryData.rows)) {
          console.log("查询结果数据结构正确，设置到state")
          setQueryResult(queryData)
        } else if (queryData && queryData.columns && Array.isArray(queryData.columns)) {
          // 如果有columns但没有rows，创建空的rows数组
          console.log("查询结果有columns但无rows，创建空rows")
          setQueryResult({
            ...queryData,
            rows: []
          })
        } else {
          console.warn("查询结果数据结构异常:", queryData)
          setError(`查询结果数据格式异常: columns=${JSON.stringify(queryData?.columns)}, rows=${JSON.stringify(queryData?.rows)}`)
        }
      } else {
        console.error("SQL查询API响应表示失败:", apiResponse)
        setError(apiResponse?.message || "查询执行失败")
      }
    } catch (err) {
      console.error("执行查询出错:", err)
      setError("执行查询时发生错误")
    } finally {
      setIsExecutingQuery(false)
    }
  }

  const handleDownloadQuery = () => {
    if (!queryResult) {
      setError("没有可下载的查询结果")
      return
    }

    try {
      // 将查询结果转换为 CSV 格式
      const headers = queryResult.columns.join(',')
      const rows = queryResult.rows.map((row: any) =>
        queryResult.columns.map((col: string) => `"${row[col]}"`).join(',')
      ).join('\n')
      const csvContent = `${headers}\n${rows}`

      // 创建 Blob 对象
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      // 创建下载链接并触发下载
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `query-result-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("下载查询结果出错:", err)
      setError("下载查询结果时发生错误")
    }
  }

  const handleCreateDatabase = async () => {
    if (!newDatabaseData.name) {
      setError("数据库名称不能为空")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 使用 API 创建数据库
      const response = await databaseApi.createDatabase({
        name: newDatabaseData.name,
        charset: newDatabaseData.charset,
        collation: newDatabaseData.collation,
        size: "0 MB", // 新创建的数据库初始大小
        tables: 0 // 新创建的数据库初始表数量
      })

      // 响应拦截器处理后，数据在response.data中
      const apiResponse = response.data as any;
      if (apiResponse && apiResponse.success === true) {
        // 添加新创建的数据库到列表
        setDatabases([...databases, apiResponse.data])
        setIsCreateDatabaseOpen(false)
        // 重置表单
        setNewDatabaseData({
          name: "",
          charset: "UTF-8",
          collation: "en_US.UTF-8"
        })
      } else {
        setError(apiResponse?.message || "创建数据库失败")
      }
    } catch (err) {
      console.error("创建数据库出错:", err)
      setError("创建数据库时发生错误")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDatabase = async () => {
    if (!databaseToDelete) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 使用 API 删除数据库
      const response = await databaseApi.deleteDatabase(databaseToDelete)

      // 响应拦截器处理后，数据在response.data中
      const apiResponse = response.data as any;
      if (apiResponse && apiResponse.success === true) {
        // 从列表中移除已删除的数据库
        setDatabases(databases.filter(db => db.id !== databaseToDelete))
        if (selectedDatabase === databaseToDelete) {
          setSelectedDatabase(databases[0]?.id || "")
        }
        setIsConfirmDeleteOpen(false)
        setDatabaseToDelete(null)
      } else {
        setError(apiResponse?.message || "删除数据库失败")
      }
    } catch (err) {
      console.error("删除数据库出错:", err)
      setError("删除数据库时发生错误")
    } finally {
      setIsLoading(false)
    }
  }

  // 过滤数据库
  const filteredDatabases = databases.filter(db =>
    db.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    db.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 如果是初始加载状态，显示全屏加载界面
  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 relative">
                <Database className="w-16 h-16 text-primary animate-pulse" />
              </div>
              <CardTitle>正在加载关系型数据库</CardTitle>
              <CardDescription>
                系统正在初始化数据库连接，这可能需要约50秒的时间
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>加载进度</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  正在建立数据库连接...
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">关系型数据库管理</h1>
          <p className="text-muted-foreground">管理和查询关系型数据库</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDatabaseOpen} onOpenChange={setIsCreateDatabaseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Database className="mr-2 h-4 w-4" />
                创建数据库
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新数据库</DialogTitle>
                <DialogDescription>
                  创建一个新的关系型数据库。请填写以下信息。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="db-name" className="text-right">
                    数据库名称
                  </Label>
                  <Input
                    id="db-name"
                    value={newDatabaseData.name}
                    onChange={(e) => setNewDatabaseData({ ...newDatabaseData, name: e.target.value })}
                    placeholder="输入数据库名称"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="db-charset" className="text-right">
                    字符集
                  </Label>
                  <Select
                    value={newDatabaseData.charset}
                    onValueChange={(value) => setNewDatabaseData({ ...newDatabaseData, charset: value })}
                  >
                    <SelectTrigger id="db-charset" className="col-span-3">
                      <SelectValue placeholder="选择字符集" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTF-8">UTF-8</SelectItem>
                      <SelectItem value="UTF-16">UTF-16</SelectItem>
                      <SelectItem value="ASCII">ASCII</SelectItem>
                      <SelectItem value="GBK">GBK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="db-collation" className="text-right">
                    排序规则
                  </Label>
                  <Select
                    value={newDatabaseData.collation}
                    onValueChange={(value) => setNewDatabaseData({ ...newDatabaseData, collation: value })}
                  >
                    <SelectTrigger id="db-collation" className="col-span-3">
                      <SelectValue placeholder="选择排序规则" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_US.UTF-8">en_US.UTF-8</SelectItem>
                      <SelectItem value="zh_CN.UTF-8">zh_CN.UTF-8</SelectItem>
                      <SelectItem value="C">C (Binary)</SelectItem>
                      <SelectItem value="POSIX">POSIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="db-template" />
                      <label
                        htmlFor="db-template"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        使用模板数据库
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDatabaseOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateDatabase} disabled={isLoading || !newDatabaseData.name}>
                  {isLoading ? "创建中..." : "创建数据库"}
                </Button>
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
          <TabsTrigger value="databases">数据库列表</TabsTrigger>
          <TabsTrigger value="tables">表管理</TabsTrigger>
          <TabsTrigger value="query">SQL 查询</TabsTrigger>
        </TabsList>

        <TabsContent value="databases" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索数据库..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSearchQuery("")}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">重置筛选</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                try {
                  setLoadingDatabases(true)
                  setError(null)
                  console.log("刷新数据库列表...")
                  const response = await relationalApi.getRelationalDatabases()
                  console.log("刷新API响应:", response)

                  // 使用与主要fetchDatabases相同的处理逻辑
                  const apiResponse = response.data as any;
                  if (apiResponse && apiResponse.success === true) {
                    console.log("刷新成功，数据库列表:", apiResponse.data)
                    setDatabases(apiResponse.data || [])
                  } else {
                    console.error("刷新API响应表示失败:", apiResponse)
                    setError(apiResponse?.message || "刷新数据库列表失败")
                  }
                } catch (err) {
                  console.error("刷新数据库列表出错:", err)
                  setError(`刷新数据库列表时发生错误: ${err instanceof Error ? err.message : '未知错误'}`)
                } finally {
                  setLoadingDatabases(false)
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
              <div>字符集</div>
              <div>排序规则</div>
              <div>大小</div>
              <div className="text-right">操作</div>
            </div>
            <div className="divide-y">
              {loadingDatabases ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">加载中...</p>
                </div>
              ) : filteredDatabases.length === 0 ? (
                <div className="py-8 text-center">
                  <Database className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {databases.length === 0 ? "暂无数据库" : "没有匹配的数据库"}
                  </p>
                  {databases.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setIsCreateDatabaseOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      创建第一个数据库
                    </Button>
                  )}
                </div>
              ) : (
                filteredDatabases.map((db) => (
                  <div key={db.id} className="grid grid-cols-6 items-center px-4 py-3 text-sm">
                    <div className="font-medium">{db.id}</div>
                    <div>{db.name}</div>
                    <div>{db.charset}</div>
                    <div>{db.collation}</div>
                    <div>
                      {db.size}
                      <Badge variant="outline" className="ml-2">
                        {db.tables} 个表
                      </Badge>
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
                          <DropdownMenuLabel>数据库操作</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedDatabase(db.id)
                            setActiveTab("tables")
                          }}>
                            <Table className="mr-2 h-4 w-4" />
                            查看表
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedDatabase(db.id)
                            setActiveTab("query")
                            setSqlQuery(`SELECT * FROM information_schema.tables WHERE table_schema = 'public' LIMIT 10;`)
                          }}>
                            <Play className="mr-2 h-4 w-4" />
                            执行查询
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            备份
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setDatabaseToDelete(db.id)
                              setIsConfirmDeleteOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
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

        <TabsContent value="tables" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="搜索表..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">筛选</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={selectedDatabase || ""}
                onValueChange={setSelectedDatabase}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="选择数据库" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDatabases ? (
                    <SelectItem value="loading" disabled>加载中...</SelectItem>
                  ) : (
                    databases.map((db) => (
                      <SelectItem key={db.id} value={db.id}>
                        {db.name} ({db.id})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  if (!selectedDatabase) {
                    setError("请先选择数据库")
                    return
                  }
                  // 跳转到表管理页面，并传递选中的数据库ID
                  window.location.href = `/dashboard/database/relational/tables?database=${selectedDatabase}`
                }}
                disabled={!selectedDatabase}
              >
                <Table className="mr-2 h-4 w-4" />
                创建表
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>表管理</CardTitle>
              <CardDescription>
                {selectedDatabase ?
                  `${databases.find(db => db.id === selectedDatabase)?.name || selectedDatabase} 中的表` :
                  "请先选择一个数据库"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full py-8"
                onClick={() => window.location.href = "/dashboard/database/relational/tables"}
              >
                <Table className="mr-2 h-5 w-5" />
                前往表管理页面
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL 查询工具</CardTitle>
              <CardDescription>执行 SQL 查询并查看结果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="选择数据库" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingDatabases ? (
                      <SelectItem value="loading" disabled>加载中...</SelectItem>
                    ) : (
                      databases.map((db) => (
                        <SelectItem key={db.id} value={db.id}>
                          {db.name} ({db.id})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownloadQuery}
                  disabled={!queryResult}
                  title="下载查询结果"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">下载</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // 清空查询结果
                    setQueryResult(null)
                    // 重置查询语句
                    setSqlQuery("SELECT * FROM users LIMIT 10;")
                  }}
                  title="清空"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">清空</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // 保存查询语句到本地存储
                    try {
                      const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]')
                      if (!savedQueries.includes(sqlQuery)) {
                        savedQueries.unshift(sqlQuery)
                        // 只保留最近10条查询
                        if (savedQueries.length > 10) {
                          savedQueries.pop()
                        }
                        localStorage.setItem('savedQueries', JSON.stringify(savedQueries))
                      }
                      alert('查询已保存')
                    } catch (err) {
                      console.error('保存查询失败:', err)
                    }
                  }}
                  title="保存查询"
                >
                  <Save className="h-4 w-4" />
                  <span className="sr-only">保存查询</span>
                </Button>
              </div>

              <Textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="font-mono min-h-[200px]"
                placeholder="输入 SQL 查询语句..."
              />

              <div className="flex justify-end">
                <Button onClick={handleExecuteQuery} disabled={isExecutingQuery || !selectedDatabase}>
                  {isExecutingQuery ? (
                    <>
                      <Play className="mr-2 h-4 w-4 animate-pulse" />
                      执行中...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      执行查询
                    </>
                  )}
                </Button>
              </div>

              {queryResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      查询结果: <span className="font-medium">{queryResult.rowCount || queryResult.rows?.length || 0} 行</span>
                    </div>
                    <div>
                      执行时间: <span className="font-medium">{queryResult.executionTime}</span>
                    </div>
                  </div>

                  <div className="rounded-md border overflow-auto">
                    <TableComponent>
                      <TableHeader>
                        <TableRow>
                          {queryResult.columns.map((column: string) => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResult.rows.map((row: any, index: number) => (
                          <TableRow key={index}>
                            {queryResult.columns.map((column: string) => (
                              <TableCell key={column}>{row[column]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </TableComponent>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleDownloadQuery}>
                      <Download className="mr-2 h-4 w-4" />
                      下载结果
                    </Button>
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
            <DialogTitle>确认删除数据库</DialogTitle>
            <DialogDescription>
              您确定要删除数据库 "{databases.find(db => db.id === databaseToDelete)?.name || databaseToDelete}" 吗？此操作不可撤销，将永久删除该数据库及其所有数据。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>危险操作</AlertTitle>
              <AlertDescription>
                删除数据库将永久移除所有相关的表、索引、视图和存储过程。此操作无法恢复。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteDatabase} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  确认删除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}