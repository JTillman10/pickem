import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserToAuthenticate } from '../user/models/user-to-authenticate.model';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { JwtResponse } from './models/jwt-response.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async authenticate(
    userToAuthenticate: UserToAuthenticate,
  ): Promise<JwtResponse> {
    const user: User = await this.userService.getUserByEmail(
      userToAuthenticate.email,
    );
    if (!user) {
      throw new BadRequestException('Unknown email address');
    }

    const match = await this.compareHash(
      userToAuthenticate.password,
      user.password,
    );

    if (!match) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign(userToAuthenticate);

    user.password = null;

    return {
      expiresIn: 7200,
      accessToken,
      userId: user.id,
    };
  }

  async validateUser(email: string): Promise<User> {
    return await this.userService.getUserByEmail(email);
  }

  async encrypt(password: string): Promise<string> {
    return this.getHash(password);
  }

  private async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  private async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
