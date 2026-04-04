import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** API `specs` may be an object, a JSON string, or empty — avoid iterating string characters as rows. */
export function normalizeProductSpecs(specs: unknown): Record<string, string> {
  if (specs == null) return {};
  if (typeof specs === 'string') {
    try {
      const parsed = JSON.parse(specs) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(([k, v]) => [
            k,
            formatSpecValue(v),
          ]),
        );
      }
    } catch {
      return {};
    }
    return {};
  }
  if (typeof specs === 'object' && !Array.isArray(specs)) {
    return Object.fromEntries(
      Object.entries(specs as Record<string, unknown>).map(([k, v]) => [k, formatSpecValue(v)]),
    );
  }
  return {};
}

function formatSpecValue(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
