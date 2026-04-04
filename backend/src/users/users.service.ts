import { Injectable, NotFoundException } from '@nestjs/common';
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
    ) { }

    async findAll() {
        return this.userRepository.find();
    }

    async findById(id: string) {
        return this.userRepository.findOne({ where: { id } });
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

