import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { NewUser } from './models/new-user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async create(newUser: NewUser): Promise<User> {
    newUser.role = 'user';
    const user = await this.userRepository.save(newUser);
    user.password = null;
    return user;
  }
}
