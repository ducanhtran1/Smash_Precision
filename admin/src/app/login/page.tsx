'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-white font-mono text-black">
        <span className="text-[10px] tracking-widest uppercase">Initializing...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromQuery = searchParams.get('token');
    if (!tokenFromQuery) return;

    const consumeToken = async () => {
      try {
        setDebug(`Verifying token via ${API_BASE}/auth/profile`);
        const profileRes = await fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${tokenFromQuery}` },
          cache: 'no-store',
        });
        if (!profileRes.ok) {
          const body = await profileRes.text();
          throw new Error(`Token verify failed (${profileRes.status}): ${body}`);
        }

        const profile = await profileRes.json();
        if (profile.role !== 'admin') throw new Error(`Role is "${profile.role ?? 'unknown'}"`);

        localStorage.setItem('admin_token', tokenFromQuery);
        router.replace('/');
      } catch (err: any) {
        setError('Unauthorized Access. System Operator clearance required.');
        setDebug(err?.message || 'Unknown error while consuming token.');
      }
    };

    consumeToken();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      setDebug(`Logging in via ${API_BASE}/auth/login`);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      
      localStorage.setItem('admin_token', data.access_token);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setDebug(err?.message || 'Unknown login error.');
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
          <Input
            label="Operator Identifier"
            type="email"
            required
            variant="underline"
            placeholder="operator@smash.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Passcode"
            type="password"
            required
            variant="underline"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
          {debug && (
            <p className="text-[10px] leading-relaxed text-neutral-500 break-all">
              {debug}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="mt-4"
            fullWidth
            size="lg"
          >
            Authorize Login
          </Button>
        </form>
      </div>
    </div>
  );
}
