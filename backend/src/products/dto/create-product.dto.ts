import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Pro Tennis Racket', description: 'The name of the product' })
  name: string;

  @ApiProperty({ example: 'Rackets', description: 'Product main category' })
  category: string;

  @ApiProperty({ example: 'A superior choice for advanced players.', description: 'Product description' })
  description: string;

  @ApiProperty({ example: 199.99, description: 'The price of the product' })
  price: number;

  @ApiProperty({ example: 50, description: 'The current stock quantity' })
  stock: number;

  @ApiProperty({ example: 'Tennis', required: false, description: 'Optional subcategory' })
  subCategory?: string;

  @ApiProperty({ example: false, required: false, description: 'Is it a limited edition' })
  isLimited?: boolean;

  @ApiProperty({ required: false, description: 'Technical specifications' })
  specs?: any;

  @ApiProperty({ type: 'string', format: 'binary', isArray: true, description: 'Product images to upload' })
  images: any[];
}
