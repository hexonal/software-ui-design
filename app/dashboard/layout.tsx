"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Database,
  HardDrive,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  VideoIcon as Vector,
  Map,
  Server,
  Layers,
  Table,
  Upload,
  Users,
  Shield,
  BarChart,
  Save,
  FolderTree,
  Package,
  HardDriveIcon as HardDisk,
  FileText,

  Key,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { getSidebarNavItems } from "@/lib/api/system"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Database,
  HardDrive,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  Vector,
  Map,
  Server,
  Layers,
  Table,
  Upload,
  Users,
  Shield,
  BarChart,
  Save,
  FolderTree,
  Package,
  HardDisk,
  FileText,

  Key,
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  // 完全重写侧边栏导航的实现，修复点击问题
  // 1. 在 DashboardLayout 组件中添加状态来跟踪展开的菜单项:
  const [openItems, setOpenItems] = useState<number[]>([])

  // 2. 添加一个切换菜单展开状态的函数:
  const toggleItem = (index: number) => {
    setOpenItems((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]))
  }

  const [navItems, setNavItems] = useState<any[]>([])

  useEffect(() => {
    async function fetchNavItems() {
      try {
        console.log('开始获取侧边栏导航数据...')
        const res = await getSidebarNavItems()
        console.log('API响应:', res)

        // res是axios响应对象，res.data是经过响应拦截器处理的ApiResponse结构
        const apiResponse = (res as any).data
        console.log('ApiResponse 结构:', {
          success: apiResponse?.success,
          code: apiResponse?.code,
          message: apiResponse?.message,
          dataType: typeof apiResponse?.data,
          dataLength: Array.isArray(apiResponse?.data) ? apiResponse.data.length : 'not array',
          data: apiResponse?.data
        })

        if (apiResponse && apiResponse.success && Array.isArray(apiResponse.data)) {
          console.log('原始数据详细结构:')
          apiResponse.data.forEach((item: any, index: number) => {
            console.log(`菜单项 ${index}:`, {
              title: item.title,
              href: item.href,
              icon: item.icon,
              hasItems: !!item.items,
              itemsLength: item.items ? item.items.length : 0,
              items: item.items
            })
          })

          // 递归替换 icon 字段为组件
          type NavItem = { icon?: string; items?: NavItem[] } & Record<string, any>
          const mapIcons = (items: NavItem[]): any[] =>
            items.map((item) => ({
              ...item,
              icon: item.icon && iconMap[item.icon as string] ? iconMap[item.icon as string] : undefined,
              items: item.items && item.items.length > 0 ? mapIcons(item.items) : undefined,
            }))
          const mappedItems = mapIcons(apiResponse.data)

          console.log('映射后的数据详细结构:')
          mappedItems.forEach((item: any, index: number) => {
            console.log(`映射后菜单项 ${index}:`, {
              title: item.title,
              href: item.href,
              iconMapped: !!item.icon,
              hasItems: !!item.items,
              itemsLength: item.items ? item.items.length : 0,
              items: item.items
            })
          })

          setNavItems(mappedItems)
        } else {
          console.error('API响应格式不正确:', apiResponse)
          setNavItems([])
        }
      } catch (error) {
        console.error('获取侧边栏导航失败:', error)
        setNavItems([])
      }
    }

    fetchNavItems()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Database className="h-6 w-6" />
            <span>分布式融合管理系统</span>
          </Link>
        </div>
        <div className="space-y-1 p-2 overflow-y-auto h-[calc(100vh-8rem)]">
          <SidebarNav items={navItems} />
        </div>
        <div className="absolute bottom-0 w-full border-t p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">管理</span>
                  </div>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">系统管理员</span>
                    <span className="text-xs text-gray-500">admin@example.com</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>账户设置</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
          <div className="flex-1 font-semibold">
            {navItems.find((item) =>
              item.exact ? pathname === item.href : item.href && pathname.startsWith(item.href),
            )?.title ||
              navItems
                .flatMap((item) => item.items || [])
                .find((item) => (item.exact ? pathname === item.href : item.href && pathname.startsWith(item.href)))
                ?.title ||
              "仪表板"}
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
