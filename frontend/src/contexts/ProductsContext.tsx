import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { io } from 'socket.io-client';
import { Product } from '@/src/types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

/** Base URL for the API (no trailing slash). Dev: '' uses Vite proxy → http://localhost:3001. Set VITE_API_URL to override. */
function apiOrigin(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return '';
}

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const base = apiOrigin();
      const primary = base ? `${base}/api/products` : '/api/products';
      let response: Response;
      try {
        response = await fetch(primary, { cache: 'no-store' });
      } catch (fetchError) {
        if (base) {
          throw fetchError;
        }
        throw new Error('Ensure your VITE_API_URL environment variable is set. Proxy fetch failed.');
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: unknown) {
      console.error('Error fetching products:', err);
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      if (!silent) {
        setError(
          msg === 'Failed to fetch' || msg.startsWith('Load failed')
            ? 'Failed to fetch — start the API (e.g. yarn dev:backend on port 3001) and keep using the Vite dev server (yarn dev:frontend) so /api is proxied.'
            : msg,
        );
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts({ silent: true }).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [fetchProducts]);

  // Global WebSocket listener for real-time stock sync across all components
  useEffect(() => {
    const socket = io(apiOrigin() || import.meta.env.VITE_API_URL || '');
    socket.on('stock_update', (data: { productId: string; stock: number }) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === data.productId ? { ...p, stock: data.stock } : p
        )
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const value = useMemo(
    () => ({ products, loading, error, refreshProducts }),
    [products, loading, error, refreshProducts],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
