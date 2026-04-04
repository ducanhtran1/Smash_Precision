import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Postgres user UUID (omit if using firebaseUid)',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Firebase Auth UID (used by the SPA checkout)',
    required: false,
  })
  firebaseUid?: string;

  @ApiProperty({
    description:
      'User email — required on first order to create a local User row',
    required: false,
  })
  email?: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({
    type: [String],
    description: 'Product IDs',
    example: ['uuid-1'],
  })
  productIds: string[];

  @ApiProperty({
    type: [Number],
    description: 'Quantities matching productIds',
    example: [1],
  })
  quantities: number[];

  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  street?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  zip?: string;
}
