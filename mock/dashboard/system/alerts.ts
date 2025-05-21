// 告警 mock 数据
export const mockAlerts = [
  {
    id: "alert-001",
    title: "CPU 使用率过高",
    message: "节点 node-1 的 CPU 使用率已超过 90%",
    severity: "critical",
    source: "节点监控",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10分钟前
    acknowledged: false,
    resolved: false,
  },
  {
    id: "alert-002",
    title: "磁盘空间不足",
    message: "存储节点磁盘空间低于 10%",
    severity: "high",
    source: "存储监控",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1小时前
    acknowledged: true,
    resolved: false,
  },
]

// 告警规则 mock 数据
export const mockRules = [
  {
    id: "rule-001",
    name: "CPU使用率监控",
    description: "当CPU使用率超过阈值时触发告警",
    condition: "CPU使用率 > 90% 持续 5分钟",
    severity: "critical",
    enabled: true,
    target: "所有节点",
    notificationChannels: ["邮件", "短信", "系统通知"],
  },
]

// 通知渠道 mock 数据
export const mockChannels = [
  {
    id: "channel-001",
    name: "系统管理员邮件组",
    type: "邮件",
    recipients: "admin@example.com, sysops@example.com",
    enabled: true,
  },
]

// 假接口
export function getSystemAlerts() {
  return Promise.resolve({ success: true, data: mockAlerts })
}

export function getAlertRules() {
  return Promise.resolve({ success: true, data: mockRules })
}

export function getAlertChannels() {
  return Promise.resolve({ success: true, data: mockChannels })
}

// 规则操作
export function addAlertRule(rule: any) {
  mockRules.push({ ...rule, id: `rule-${Date.now()}` })
  return Promise.resolve({ success: true })
}

export function updateAlertRule(rule: any) {
  const idx = mockRules.findIndex(r => r.id === rule.id)
  if (idx !== -1) {
    mockRules[idx] = { ...mockRules[idx], ...rule }
    return Promise.resolve({ success: true })
  }
  return Promise.resolve({ success: false })
}

export function deleteAlertRule(id: string) {
  const idx = mockRules.findIndex(r => r.id === id)
  if (idx !== -1) {
    mockRules.splice(idx, 1)
    return Promise.resolve({ success: true })
  }
  return Promise.resolve({ success: false })
}

// 渠道操作
export function addAlertChannel(channel: any) {
  mockChannels.push({ ...channel, id: `channel-${Date.now()}` })
  return Promise.resolve({ success: true })
}

export function updateAlertChannel(channel: any) {
  const idx = mockChannels.findIndex(c => c.id === channel.id)
  if (idx !== -1) {
    mockChannels[idx] = { ...mockChannels[idx], ...channel }
    return Promise.resolve({ success: true })
  }
  return Promise.resolve({ success: false })
}

export function deleteAlertChannel(id: string) {
  const idx = mockChannels.findIndex(c => c.id === id)
  if (idx !== -1) {
    mockChannels.splice(idx, 1)
    return Promise.resolve({ success: true })
  }
  return Promise.resolve({ success: false })
} 