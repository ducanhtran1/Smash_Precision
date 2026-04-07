'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      
      // Store token
      localStorage.setItem('admin_token', data.access_token);
      
      // Verify Role
      const profileRes = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      const profile = await profileRes.json();

      if (profile.role !== 'admin') {
        localStorage.removeItem('admin_token');
        throw new Error('Unauthorized Access. System Operator clearance required.');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white font-mono selection:bg-black selection:text-white">
      <div className="w-full max-w-sm p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 border-b-2 border-black pb-4 mb-4">
            <div className="h-6 w-6 bg-black"></div>
            <span className="font-bold tracking-[0.2em] text-sm uppercase">Smash Precision</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">System Access</h1>
          <p className="text-xs text-neutral-500 tracking-widest uppercase">Admin clearance only</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
              Operator Identifier
            </label>
            <input
              type="email"
              required
              className="w-full border-b-2 border-neutral-200 py-3 text-sm font-medium outline-none transition-colors focus:border-black"
              placeholder="operator@smash.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
              Passcode
            </label>
            <input
              type="password"
              required
              className="w-full border-b-2 border-neutral-200 py-3 text-sm font-medium outline-none transition-colors focus:border-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 tracking-wider">
              [ERROR] {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-black py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all hover:bg-neutral-800 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Authorize Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
