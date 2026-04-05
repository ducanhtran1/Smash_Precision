import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Post,
  HttpCode,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue('orders') private readonly ordersQueue: Queue,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all orders for a specific user' })
  @ApiResponse({ status: 200, description: 'Return array of orders' })
  findByUserId(@Param('userId') userId: string) {
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Return a single order' })
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  @HttpCode(202)
  @ApiOperation({
    summary: 'Enqueue a new order',
    description: 'Places the order into a background processing queue',
  })
  @ApiResponse({ status: 202, description: 'Order successfully queued' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const queueId = Date.now().toString() + '-' + Math.floor(Math.random() * 10000);
    await this.ordersQueue.add('process-order', { ...createOrderDto, queueId });
    return { status: 'queued', message: 'Order placed in queue', queueId };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
