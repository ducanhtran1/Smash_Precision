// Base API configuration for the admin panel

export const API_BASE = "http://localhost:3001/api";

export async function fetcher(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}
