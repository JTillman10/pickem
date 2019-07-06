import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserToAuthenticate } from '../user/models/user-to-authenticate.model';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { apiPrefix } from '../../config';

@Controller(`${apiPrefix}/auth`)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() userToAuthenticate: UserToAuthenticate) {
    return await this.authService.authenticate(userToAuthenticate);
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) newUser: User) {
    const { password } = newUser;
    newUser.password = await this.authService.encrypt(password);
    const createdUser = await this.userService.create(newUser);

    const userToAuthenticate: UserToAuthenticate = {
      email: createdUser.email,
      password,
    };

    return await this.authService.authenticate(userToAuthenticate);
  }
}
