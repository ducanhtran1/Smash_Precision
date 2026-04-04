import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
         const { password, ...result } = user;
         return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, firebaseUid: user.firebaseUid };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      displayName: registerDto.displayName,
    });
    
    return this.login(user);
  }
}
