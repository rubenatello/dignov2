"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/authApi';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      router.push('/dashboard/editor');
    } else {
      setError(result.error || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Sign In</button>
      </form>
    </div>
  );
}
