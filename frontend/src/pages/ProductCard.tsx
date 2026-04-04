import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function ProductCard({ product }) {
  const [currentStock, setCurrentStock] = useState(product.stock);

  useEffect(() => {
    // 1. Connect to your NestJS backend WebSocket server
    const socket = io('http://localhost:3000'); // Use your actual backend URL

    // 2. Listen for the specific 'stock_updated' event
    socket.on('stock_updated', (data) => {
      // Check if the update is for THIS specific product
      if (data.productId === product.id) {
        setCurrentStock(data.stock); // Instantly updates the UI!
      }
    });

    // 3. Cleanup connection when the user leaves the page
    return () => {
      socket.disconnect();
    };
  }, [product.id]);

  return (
    <div>
      <h2>{product.name}</h2>
      
      {/* Dynamic UI based on real-time stock */}
      {currentStock > 0 ? (
        <p className="text-red-500 font-bold">Only {currentStock} left in stock!</p>
      ) : (
        <p className="text-gray-500">Out of stock</p>
      )}

      <button disabled={currentStock === 0}>
        {currentStock === 0 ? "Sold Out" : "Add to Cart"}
      </button>
    </div>
  );
}
