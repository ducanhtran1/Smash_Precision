import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'The ID of the user placing the order', example: 'uuid-string-here' })
  userId: string;

  @ApiProperty({ type: [String], description: 'Array of product IDs', example: ['product-id-1', 'product-id-2'] })
  productIds: string[];

  @ApiProperty({ type: [Number], description: 'Array of quantities corresponding to product IDs', example: [1, 2] })
  quantities: number[];
}
