import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PickService } from '../pick/pick.service';
import { GameService } from '../game/game.service';
import { Pick } from '../pick/pick.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly pickService: PickService,
    private readonly gameService: GameService,
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

  async create(newUser: User): Promise<User> {
    // TODO: check if email exists
    const user = await this.userRepository.save(newUser);
    user.password = null;
    return user;
  }

  async getPicksForUser(
    id: number,
    season: number,
    week: number,
  ): Promise<Pick[]> {
    return await this.pickService.getPicksByUser(id, season, week);
  }

  async createPicksForUser(id: number, picks: Pick[]): Promise<Pick[]> {
    const user = await this.getUserById(id);

    picks = await Promise.all(
      picks.map(async (pick: Pick) => {
        pick.user = user;
        pick.game = await this.gameService.getGameById(pick.game.id);
        return pick;
      }),
    );

    return await this.pickService.savePicks(picks);
  }
}
