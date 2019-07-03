import {
  Controller,
  Get,
  Body,
  ValidationPipe,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './game.entity';
import { AuthGuard } from '@nestjs/passport';
import { ScraperService } from './scraper.service';

@Controller('games')
@UseGuards(AuthGuard('jwt'))
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly scraperService: ScraperService,
  ) {}

  @Get()
  async getAllGames(): Promise<Game[]> {
    return this.gameService.getAllGames();
  }

  @Post('single')
  // @Roles('ADMIN')
  async createGame(@Body(new ValidationPipe()) newGame: Game): Promise<Game> {
    return await this.gameService.createGame(newGame);
  }

  @Post()
  // @Roles('ADMIN')
  async createGames(@Body() newGames: Game[]): Promise<Game[]> {
    return await this.gameService.createGames(newGames);
  }

  @Post('scrape')
  // @Roles('ADMIN')
  async scrapeGames(): Promise<Game[]> {
    const newGames: Game[] = await this.scraperService.scrape();
    await this.gameService.createGames(newGames);
    return newGames;
  }

  @Delete()
  // @Roles('ADMIN')
  async deleteAllGames(): Promise<void> {
    return await this.gameService.deleteAllGames();
  }
}
