"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Upload, Download, Trash2, FolderIcon, FileIcon, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// 导入 API
import * as storageApi from "@/lib/api/storage"
import { FileInfo } from "@/lib/api/storage"

// 存储统计信息类型
interface StorageStats {
  totalSpace: number
  usedSpace: number
  freeSpace: number
  usagePercentage: number
}

export default function FileStoragePage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [currentPath, setCurrentPath] = useState("/")
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [storageStats, setStorageStats] = useState<StorageStats>({
    totalSpace: 100 * 1024 * 1024 * 1024, // 100GB in bytes
    usedSpace: 45.8 * 1024 * 1024 * 1024, // 45.8GB in bytes
    freeSpace: 54.2 * 1024 * 1024 * 1024, // 54.2GB in bytes
    usagePercentage: 45.8
  })

  const { toast } = useToast()

  // 获取文件列表
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('获取文件列表，路径:', currentPath)

        const response = await storageApi.getFiles(currentPath)
        console.log('API响应:', response)

        // 判断API调用是否成功 - 基于后端Result<T>结构
        // success为true表示HTTP请求成功且后端返回code=200
        if (response.success === true) {
          if (response.data && Array.isArray(response.data)) {
            setFiles(response.data)
            console.log('设置文件列表成功:', response.data.length, '个文件')
            // 成功时不显示toast，避免过多通知
          } else {
            // API成功但没有数据或数据格式不正确
            setFiles([])
            console.log('API成功但返回数据为空或格式错误')
          }
        } else {
          // API失败 - response.success为false或后端返回的code不是200
          const errorMessage = response.message || '获取文件列表失败'
          setError(errorMessage)
          setFiles([])
          console.error('API返回失败状态:', {
            success: response.success,
            message: response.message,
            responseData: response
          })

          // 显示错误toast
          toast({
            variant: "destructive",
            title: "获取文件列表失败",
            description: errorMessage,
          })
        }
      } catch (err) {
        // 网络错误或其他异常
        const errorMessage = '获取文件数据失败，请检查网络连接'
        setError(errorMessage)
        setFiles([])
        console.error('获取文件列表异常:', err)

        // 显示网络错误toast
        toast({
          variant: "destructive",
          title: "网络错误",
          description: errorMessage,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [currentPath, toast])

  // 获取存储统计信息
  useEffect(() => {
    const fetchStorageStats = async () => {
      try {
        const response = await storageApi.getStorageOverviewStats()
        if (response.success && response.data) {
          // 根据后端返回的数据结构调整
          const stats = response.data
          setStorageStats({
            totalSpace: stats.totalSpace || 100 * 1024 * 1024 * 1024,
            usedSpace: stats.usedSpace || 45.8 * 1024 * 1024 * 1024,
            freeSpace: stats.freeSpace || 54.2 * 1024 * 1024 * 1024,
            usagePercentage: stats.usagePercentage || 45.8
          })
        }
      } catch (err) {
        console.error('获取存储统计失败:', err)
        // 使用默认值，不影响主要功能
      }
    }

    fetchStorageStats()
  }, [])

  // 处理文件上传
  const handleUpload = async (file: File) => {
    if (!file) return

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // 模拟上传进度（实际项目中可以监听真实的上传进度）
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 10
          return next >= 90 ? 90 : next // 停在90%，等待实际上传完成
        })
      }, 200)

      const response = await storageApi.uploadFile(currentPath, file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success === true) {
        // 上传成功，显示成功toast
        toast({
          title: "文件上传成功",
          description: `文件 "${file.name}" 已成功上传到 ${currentPath}`,
        })

        setTimeout(() => {
          setIsUploading(false)
          setIsUploadOpen(false)
          setUploadProgress(0)
          // 重新获取文件列表
          window.location.reload() // 简单刷新，实际项目中可以优化为局部刷新
        }, 1000)
      } else {
        // 上传失败
        const errorMessage = response.message || '文件上传失败'
        console.error('文件上传失败:', response)
        setError(errorMessage)
        setIsUploading(false)
        setUploadProgress(0)

        // 显示上传失败toast
        toast({
          variant: "destructive",
          title: "文件上传失败",
          description: errorMessage,
        })
      }
    } catch (err) {
      console.error('文件上传异常:', err)
      const errorMessage = err instanceof Error ? err.message : '文件上传失败'
      setError(errorMessage)
      setIsUploading(false)
      setUploadProgress(0)

      // 显示上传异常toast
      toast({
        variant: "destructive",
        title: "文件上传异常",
        description: errorMessage,
      })
    }
  }

  // 处理文件上传事件
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  // 处理文件夹导航
  const handleFolderNavigation = (folderPath: string) => {
    setCurrentPath(folderPath)
  }

  // 处理文件删除
  const handleDeleteFile = async (filePath: string) => {
    try {
      const response = await storageApi.deleteFile(filePath)
      if (response.success === true) {
        // 删除成功，从列表中移除该文件
        setFiles(files.filter(file => file.path !== filePath))
        console.log('文件删除成功:', filePath)

        // 显示删除成功toast
        toast({
          title: "文件删除成功",
          description: `文件已成功删除`,
        })
      } else {
        // 删除失败
        const errorMessage = response.message || '删除文件失败'
        setError(errorMessage)
        console.error('删除文件失败:', response)

        // 显示删除失败toast
        toast({
          variant: "destructive",
          title: "删除文件失败",
          description: errorMessage,
        })
      }
    } catch (err) {
      console.error('删除文件异常:', err)
      const errorMessage = '删除文件失败'
      setError(errorMessage)

      // 显示删除异常toast
      toast({
        variant: "destructive",
        title: "删除文件异常",
        description: errorMessage,
      })
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // 格式化时间
  const formatDateTime = (dateTime: string | Date): string => {
    try {
      const date = dateTime instanceof Date ? dateTime : new Date(dateTime)
      return date.toLocaleString('zh-CN')
    } catch {
      return '-'
    }
  }

  // 过滤文件
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文件存储</h1>
          <p className="text-muted-foreground">管理文件存储系统</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                上传文件
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>上传文件</DialogTitle>
                <DialogDescription>将文件上传到当前目录：{currentPath}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">选择文件</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileInputChange}
                    disabled={isUploading}
                  />
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">上传进度</span>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">正在上传文件，请勿关闭窗口...</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isUploading}>
                  取消
                </Button>
                <Button onClick={() => document.getElementById('file-upload')?.click()} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      上传中...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      选择文件
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <FolderIcon className="mr-2 h-4 w-4" />
            新建文件夹
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

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索文件和文件夹..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">筛选</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>文件浏览器</CardTitle>
              <Badge variant="outline" className="ml-2">
                已使用: {formatFileSize(storageStats.usedSpace)} / {formatFileSize(storageStats.totalSpace)}
              </Badge>
            </div>
            <CardDescription>当前位置</CardDescription>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleFolderNavigation("/")
                    }}
                  >
                    根目录
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentPath !== "/" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">{currentPath}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
                <div>名称</div>
                <div>类型</div>
                <div>大小</div>
                <div>权限</div>
                <div>修改时间</div>
                <div className="text-right">操作</div>
              </div>
              <div className="divide-y">
                {loading ? (
                  <div className="py-8 text-center">加载中...</div>
                ) : filteredFiles.length === 0 ? (
                  <div className="py-8 text-center">
                    {searchTerm ? `没有找到包含"${searchTerm}"的文件` : '当前目录为空'}
                  </div>
                ) : (
                  filteredFiles.map((file, index) => (
                    <div key={file.path + index} className="grid grid-cols-6 items-center px-4 py-3 text-sm">
                      <div className="font-medium flex items-center">
                        {file.isDirectory || file.type === "directory" ? (
                          <FolderIcon className="mr-2 h-4 w-4 text-blue-500" />
                        ) : (
                          <FileIcon className="mr-2 h-4 w-4 text-gray-500" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div>
                        <Badge variant="outline">
                          {file.isDirectory || file.type === "directory"
                            ? "文件夹"
                            : (file.name.split(".").pop()?.toUpperCase() || "文件")
                          }
                        </Badge>
                      </div>
                      <div>{file.size ? formatFileSize(file.size) : '-'}</div>
                      <div>{file.permissions || '-'}</div>
                      <div>{formatDateTime(file.modifiedTime)}</div>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">操作</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>文件操作</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {file.isDirectory || file.type === "directory" ? (
                              <DropdownMenuItem
                                onClick={() => handleFolderNavigation(file.path)}
                              >
                                打开文件夹
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>预览文件</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              下载
                            </DropdownMenuItem>
                            <DropdownMenuItem>重命名</DropdownMenuItem>
                            <DropdownMenuItem>移动</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteFile(file.path)}
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              显示 {filteredFiles?.length || 0} 个项目
              {searchTerm && ` (搜索: "${searchTerm}")`}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="outline" size="sm" disabled>
                下一页
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}