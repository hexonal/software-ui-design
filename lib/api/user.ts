import { api } from './client'
import { config } from '../../config'

export async function login(username: string, password: string): Promise<string> {
  console.log('[login] baseUrl:', config.api.baseUrl);
  console.log('[login] 请求参数:', { username, password });
  // 构造完整的 UserBO 请求体
  const reqBody = {
    createDate: '',
    createdBy: '',
    email: '',
    id: 0,
    lastLogin: '',
    password,
    role: '',
    roleId: 0,
    status: '',
    updateDate: '',
    updatedBy: '',
    username
  };
  try {
    const res = await api.post('/dfm/user/login', reqBody);
    console.log('[login] 响应:', res);
    // 兼容后端返回的 result 字段
    if (res && res.result) {
      return res.result;
    }
    if (typeof res === 'string') {
      return res;
    }
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || '登录失败');
  } catch (err) {
    console.error('[login] 请求异常:', err);
    throw err;
  }
} 