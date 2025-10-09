"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { login } from '../../lib/authApi';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Using window.location to navigate after login to avoid router type issues

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard/editor';
      }
    } else {
      setError(result.error || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Digno Logo" width={80} height={80} className="mb-2" priority />
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Studio Editor</h3>
          <p className="text-gray-500 text-sm text-center mb-2">Sign in to access the Digno Studio Editor. This is not for news subscribers.</p>
        </div>
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-center">Sign In</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="w-full bg-cta text-white py-2 rounded font-semibold hover:bg-cta-darken">Sign In</button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Not a Studio user?
            <Link href="/" className="ml-1 text-primary hover:underline">Go to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
