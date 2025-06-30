'use client';

import React, { useState } from 'react';
import { login } from '../../lib/api/user';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await login(username, password);
      localStorage.setItem('token', token);
      alert('登录成功');
      // 可在此处跳转页面
    } catch (err) {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl mb-4">登录</h2>
      <input
        className="block w-full mb-3 p-2 border rounded"
        type="text"
        placeholder="用户名"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="block w-full mb-3 p-2 border rounded"
        type="password"
        placeholder="密码"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="w-full bg-blue-600 text-white py-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
} 