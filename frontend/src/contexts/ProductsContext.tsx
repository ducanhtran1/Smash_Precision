import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

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

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend is running on port 3001 locally based on previous Swagger configuration
      const response = await fetch('http://localhost:3001/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // The API returns image arrays or single strings, parse properly since we moved multiple images to cloud
      // Currently the backend type returns imageUrl as string, so it maps well to the Product type
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error, refreshProducts: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
