#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始部署前端应用...');

try {
  // 检查 dist 目录是否存在
  if (!fs.existsSync('dist')) {
    console.log('📦 未找到 dist 目录，开始构建...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  // 验证 dist 目录内容
  const distFiles = fs.readdirSync('dist');
  if (distFiles.length === 0) {
    throw new Error('dist 目录为空，请检查构建过程');
  }

  console.log('📂 dist 目录内容：');
  distFiles.forEach(file => {
    const filePath = path.join('dist', file);
    const stats = fs.statSync(filePath);
    const type = stats.isDirectory() ? '📁' : '📄';
    console.log(`  ${type} ${file}`);
  });

  console.log('\n✅ 前端应用构建完成！');
  console.log('📊 部署信息：');
  console.log(`   - 输出目录: dist`);
  console.log(`   - 文件数量: ${distFiles.length}`);
  console.log(`   - 构建时间: ${new Date().toLocaleString()}`);
  
  console.log('\n📋 部署步骤：');
  console.log('   1. 将 dist 目录上传到 Web 服务器');
  console.log('   2. 配置 Web 服务器指向 dist 目录');
  console.log('   3. 确保服务器支持 SPA 路由');
  
} catch (error) {
  console.error('❌ 部署准备失败：', error.message);
  process.exit(1);
} 