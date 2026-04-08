'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_BASE } from '@/lib/api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        if (pathname !== '/login') router.replace('/login');
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        
        if (!res.ok) throw new Error('Token invalid');
        
        const profile = await res.json();
        if (profile.role !== 'admin') throw new Error('Not admin');
        
        setIsAuthenticated(true);
        if (pathname === '/login') {
          router.replace('/');
        }
      } catch (err) {
        localStorage.removeItem('admin_token');
        if (pathname !== '/login') router.replace('/login');
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [pathname, router]);

  // Don't render the protected shell until we know authentication status
  // EXCEPT for the login page itself, which should always render immediately
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-black font-mono">
        <span className="text-[10px] tracking-widest uppercase">Verifying Clearance...</span>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Next Router will redirect
  }

  return <>{children}</>;
}
