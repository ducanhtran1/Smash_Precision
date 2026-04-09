/**
 * CORS origins for HTTP + Socket.IO.
 * Production:
 * - FRONTEND_URL: comma-separated (e.g. main Vercel app + previews).
 * - ADMIN_FRONTEND_URL: optional comma-separated admin app origin(s), e.g. https://xxx-admin.vercel.app
 *   If the admin app is on a different subdomain than the shop, you must list it or login fetch will fail with "Failed to fetch" (CORS).
 * Local dev: localhost origins are always included when NODE_ENV !== 'production'.
 */
function parseOriginList(...chunks: (string | undefined)[]): string[] {
  const out: string[] = [];
  for (const chunk of chunks) {
    if (!chunk?.trim()) continue;
    for (const part of chunk.split(',')) {
      const s = part.trim().replace(/\/+$/, '');
      if (s) out.push(s);
    }
  }
  return [...new Set(out)];
}

export function getCorsOrigins(): string[] {
  const local = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  const raw = process.env.FRONTEND_URL?.trim();
  const adminRaw = process.env.ADMIN_FRONTEND_URL?.trim();

  if (process.env.NODE_ENV === 'production') {
    if (!raw && !adminRaw) {
      console.warn(
        'FRONTEND_URL is not set; allowing localhost only. Set FRONTEND_URL for browser access.',
      );
      return local;
    }
    return parseOriginList(raw, adminRaw);
  }

  if (!raw) {
    return local;
  }
  const extra = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...local, ...extra])];
}
