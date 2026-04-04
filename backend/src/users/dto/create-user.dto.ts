import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'firebase-uid-123', description: 'The unique Firebase ID' })
  firebaseUid: string;

  @ApiProperty({ example: 'user@example.com', description: 'The user email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', required: false, description: 'The user display name' })
  displayName?: string;

  @ApiProperty({ example: 'https://example.com/photo.png', required: false, description: 'URL to the user avatar' })
  photoUrl?: string;

  @ApiProperty({ example: 'Hello World', required: false, description: 'User biography' })
  bio?: string;
  
  @ApiProperty({ example: 'dark', required: false, description: 'Preferred theme' })
  theme?: string;

  @ApiProperty({ example: 'USD', required: false, description: 'Preferred currency' })
  currency?: string;

  @ApiProperty({ example: 'metric', required: false, description: 'Preferred unit system' })
  units?: string;
}
