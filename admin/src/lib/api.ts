// Base API configuration for the admin panel

export const API_BASE = "http://localhost:3001/api";

/** Bearer token for admin API calls (DELETE/PATCH guarded routes). */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("admin_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetcher(endpoint: string, options: RequestInit = {}) {
  // Only access localStorage if we are in the browser
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      }
    }
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
