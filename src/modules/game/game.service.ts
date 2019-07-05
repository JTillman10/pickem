import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async getAllGames(): Promise<Game[]> {
    return await this.gameRepository.find();
  }

  async getGame(home: string, away: string, date: Date): Promise<Game> {
    date = new Date(date);
    const game = await this.gameRepository.findOne({ home, away, date });
    return game;
  }

  async getGameById(id: number): Promise<Game> {
    return this.gameRepository.findOne({ id });
  }

  async createGame(game: Game): Promise<Game> {
    if (!(await this.getGame(game.home, game.away, game.date))) {
      return await this.gameRepository.save(game);
    }
    throw new BadRequestException('Game already exists!');
  }

  async createGames(games: Game[]): Promise<Game[]> {
    return games.reduce(
      async (previousPromise: Promise<any>, nextGame: Game) => {
        await previousPromise;
        return this.createGame(nextGame);
      },
      Promise.resolve(),
    );
  }

  async deleteAllGames(): Promise<void> {
    return await this.gameRepository.clear();
  }
}
