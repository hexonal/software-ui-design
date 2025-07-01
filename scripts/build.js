#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始构建项目...');

try {
  // 清理旧的构建文件
  console.log('🧹 清理旧的构建文件...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }

  // 执行 Next.js 构建
  console.log('📦 执行 Next.js 构建...');
  execSync('next build', { stdio: 'inherit' });

  // 检查 out 目录是否存在
  if (!fs.existsSync('out')) {
    throw new Error('构建失败：未找到 out 目录');
  }

  // 重命名 out 目录为 dist
  console.log('📁 重命名输出目录为 dist...');
  fs.renameSync('out', 'dist');

  console.log('✅ 构建完成！输出目录：dist');
  
  // 显示构建结果信息
  const distStats = fs.statSync('dist');
  console.log(`📊 构建时间：${new Date().toLocaleString()}`);
  
} catch (error) {
  console.error('❌ 构建失败：', error.message);
  process.exit(1);
} 