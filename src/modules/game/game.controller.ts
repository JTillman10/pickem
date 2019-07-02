import {
  Controller,
  Get,
  Body,
  ValidationPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('games')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAllGames(): Promise<Game[]> {
    return this.gameService.getAllGames();
  }

  @Post()
  async createGames(@Body() newGames: Game[]): Promise<Game[]> {
    return new Promise(null);
  }

  @Post('single')
  async createGame(@Body(new ValidationPipe()) newGame: Game): Promise<Game> {
    return await this.gameService.createGame(newGame);
  }
}
