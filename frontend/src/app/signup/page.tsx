'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register/', {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirm: confirm,
      });
      // Optional: auto-login using returned token
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to home
      if (typeof window !== 'undefined') {
        window.location.href = '/';
        return;
      }
      setSuccess('Account created! You are now signed in.');
    } catch (err: any) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-600">Join to comment, like, and support Digno.</p>
        </div>

        <form className="mt-4 space-y-6" onSubmit={submit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">First name</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Last name</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={lastName} onChange={e=>setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2 text-sm" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Username</label>
            <input className="w-full border rounded px-3 py-2 text-sm" value={username} onChange={e=>setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2 text-sm" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Confirm password</label>
            <input type="password" className="w-full border rounded px-3 py-2 text-sm" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link className="text-blue-600 hover:underline" href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
