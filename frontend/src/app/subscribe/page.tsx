"use client";

import React, { useState } from 'react';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Placeholder: integrate Stripe or payment API here
      // Example: POST to /api/donations/subscribe/
      const response = await fetch('/api/donations/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount })
      });
      if (!response.ok) throw new Error('Payment failed');
      setSuccess('Thank you for subscribing!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Subscribe & Support</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Amount (USD)</label>
          <select value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded">
            <option value="5">$5</option>
            <option value="10">$10</option>
            <option value="20">$20</option>
            <option value="50">$50</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
          {loading ? 'Processing...' : 'Subscribe & Donate'}
        </button>
      </form>
    </div>
  );
}
