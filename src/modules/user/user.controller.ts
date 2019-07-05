import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { Pick } from '../pick/pick.entity';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return await this.userService.getUserById(userId);
  }

  @Get(':userId/picks')
  async getUserPicksById(
    @Param('userId') userId: number,
    @Query('season') season: number,
    @Query('week') week: number,
  ): Promise<Pick[]> {
    const picks: Pick[] = await this.userService.getPicksForUser(
      userId,
      season,
      week,
    );
    return picks;
  }

  @Post(':userId/picks')
  async createPicks(
    @Param('userId') userId: number,
    @Body() picks: Pick[],
  ): Promise<Pick[]> {
    return await this.userService.createPicksForUser(userId, picks);
  }
}
