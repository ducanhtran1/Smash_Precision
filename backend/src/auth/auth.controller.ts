import { Controller, Post, Request, UseGuards, Body, Get } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile from JWT token' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
