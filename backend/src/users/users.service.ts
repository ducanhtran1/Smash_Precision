import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByFirebaseUid(firebaseUid: string) {
    return this.userRepository.findOne({ where: { firebaseUid } });
  }

  /** Used at checkout when the Firebase user exists but no Postgres row yet. */
  async findOrCreateByFirebaseUid(
    firebaseUid: string,
    email: string,
    displayName?: string,
  ): Promise<User> {
    const existing = await this.findByFirebaseUid(firebaseUid);
    if (existing) return existing;
    if (!email?.trim()) {
      throw new BadRequestException(
        'email is required to create a local user for this order',
      );
    }
    const user = this.userRepository.create({
      firebaseUid,
      email: email.trim(),
      displayName: displayName ?? undefined,
    });
    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepository.remove(user);
  }
}
