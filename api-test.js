#!/usr/bin/env node

/**
 * DFMS API 测试脚本
 * 用于测试前后端API对接是否正确
 */

const https = require('https');
const http = require('http');

// 配置
const API_BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    username: 'admin',
    password: 'admin'
};

// 构造UserBO请求体
function createUserBO(username, password) {
    return {
        username: username,
        password: password,
        id: null,
        email: null,
        roleId: null,
        role: null,
        status: null,
        lastLogin: null,
        createDate: null,
        updateDate: null,
        createdBy: null,
        updatedBy: null
    };
}

// HTTP请求工具
function makeRequest(url, options, data = null) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        
        const req = lib.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', chunk => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: parsedData
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseData
                    });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// 测试登录API
async function testLogin() {
    console.log('🚀 开始测试登录API...\n');
    
    const userBO = createUserBO(TEST_USER.username, TEST_USER.password);
    
    console.log('📤 发送请求:');
    console.log(`URL: ${API_BASE_URL}/user/login`);
    console.log('请求体:', JSON.stringify(userBO, null, 2));
    console.log();
    
    try {
        const response = await makeRequest(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, userBO);
        
        console.log('📥 收到响应:');
        console.log(`状态码: ${response.statusCode}`);
        console.log('响应体:', JSON.stringify(response.data, null, 2));
        console.log();
        
        // 检查响应结构
        if (response.statusCode === 200) {
            const { data } = response;
            
            if (data && typeof data === 'object') {
                // 检查是否符合Result<T>结构
                if ('code' in data && 'message' in data && 'data' in data) {
                    console.log('✅ 响应结构正确 - 符合Result<T>格式');
                    
                    if (data.code === 200 && data.data) {
                        console.log('✅ 登录成功');
                        console.log(`🔑 JWT Token: ${data.data}`);
                        return data.data;
                    } else {
                        console.log('❌ 登录失败:', data.message);
                    }
                } else {
                    console.log('⚠️  响应结构不符合预期 - 可能ResponseAdvice未生效');
                    console.log('预期结构: { code, message, data }');
                    console.log('实际结构:', Object.keys(data));
                }
            } else {
                console.log('❌ 无效的响应数据');
            }
        } else {
            console.log(`❌ HTTP错误: ${response.statusCode}`);
        }
        
    } catch (error) {
        console.log('❌ 请求失败:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 提示: 请确保Java后端服务正在运行在 localhost:8080');
        }
    }
    
    return null;
}

// 测试数据库API
async function testDatabaseAPI(token) {
    if (!token) {
        console.log('⏭️  跳过数据库API测试 - 无有效token');
        return;
    }
    
    console.log('\n🗄️  开始测试数据库API...\n');
    
    try {
        const response = await makeRequest(`${API_BASE_URL}/database`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('📥 数据库列表响应:');
        console.log(`状态码: ${response.statusCode}`);
        console.log('响应体:', JSON.stringify(response.data, null, 2));
        
        if (response.statusCode === 200) {
            console.log('✅ 数据库API调用成功');
        } else {
            console.log('❌ 数据库API调用失败');
        }
        
    } catch (error) {
        console.log('❌ 数据库API请求失败:', error.message);
    }
}

// 主测试函数
async function main() {
    console.log('🔧 DFMS API 对接测试工具');
    console.log('================================\n');
    
    // 测试登录
    const token = await testLogin();
    
    // 如果登录成功，测试其他API
    await testDatabaseAPI(token);
    
    console.log('\n✨ 测试完成!');
}

// 运行测试
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testLogin, testDatabaseAPI }; 