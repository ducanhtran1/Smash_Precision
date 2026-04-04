/**
 * CORS origins for HTTP + Socket.IO.
 * Production: set FRONTEND_URL (comma-separated for multiple apps, e.g. Vercel preview + prod).
 * Local dev: localhost origins are always included when NODE_ENV !== 'production'.
 */
export function getCorsOrigins(): string[] {
  const local = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  const raw = process.env.FRONTEND_URL?.trim();

  if (process.env.NODE_ENV === 'production') {
    if (!raw) {
      console.warn(
        'FRONTEND_URL is not set; allowing localhost only. Set FRONTEND_URL for browser access.',
      );
      return local;
    }
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
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
