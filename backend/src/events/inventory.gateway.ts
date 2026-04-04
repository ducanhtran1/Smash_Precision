import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getCorsOrigins } from '@/cors-origins';

@WebSocketGateway({
  cors: {
    origin: getCorsOrigins(),
    credentials: true,
  },
})
export class InventoryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // This gives you access to the main Socket.io Server instance
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect: ${client.id}`);
  }

  // You can createa helper method to broadcast stock update
  broadcastStockUpdate(productId: string, newStockQuantity: number) {
    this.server.emit('stock_update', {
      productId: productId,
      stock: newStockQuantity,
    });
  }
}
