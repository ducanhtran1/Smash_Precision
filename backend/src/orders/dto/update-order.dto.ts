import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ example: 'SHIPPED', description: 'The new status of the order' })
  status: string;
}
