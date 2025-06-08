"use client"

import type React from "react"

import { useState } from "react"
import { Lock, RefreshCw, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 导入 API
import * as systemApi from "@/lib/api/system"

export default function SystemSettingsPage() {
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 修改密码
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // 获取表单数据
      const formData = new FormData(e.target as HTMLFormElement)
      const currentPassword = formData.get('current-password') as string
      const newPassword = formData.get('new-password') as string
      const confirmPassword = formData.get('confirm-password') as string

      // 前端验证
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('请填写所有密码字段')
        return
      }

      if (newPassword !== confirmPassword) {
        setError('新密码和确认密码不匹配')
        return
      }

      if (newPassword.length < 8) {
        setError('新密码长度至少8位')
        return
      }

      // 调用密码修改API
      const response = await systemApi.changeAdminPassword({
        currentPassword,
        newPassword,
        confirmPassword
      })

      if (response.data?.success) {
        setPasswordChanged(true)
        setTimeout(() => setPasswordChanged(false), 3000)
          // 清空表单
          ; (e.target as HTMLFormElement).reset()
      } else {
        setError(response.data?.message || '密码修改失败')
      }
    } catch (err) {
      setError('密码修改失败，请稍后重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        <p className="text-muted-foreground">管理系统的基本设置和配置</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>修改管理员密码</CardTitle>
          <CardDescription>更新系统管理员账户的密码</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            {passwordChanged && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Lock className="h-4 w-4" />
                <AlertTitle>密码已更新</AlertTitle>
                <AlertDescription>管理员密码已成功修改</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">当前密码</Label>
              <Input id="current-password" name="current-password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input id="new-password" name="new-password" type="password" required minLength={8} />
              <p className="text-xs text-muted-foreground">密码长度至少8位</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  更新中...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  更新密码
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}