import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pick } from './pick.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PickValidatorService } from './pick-validator.service';

@Injectable()
export class PickService {
  constructor(
    @InjectRepository(Pick) private readonly pickRepository: Repository<Pick>,
    private readonly pickValidatorService: PickValidatorService,
  ) {}

  async getAllPicks(): Promise<Pick[]> {
    return await this.pickRepository.find();
  }

  async getPicksByUser(
    userId: number,
    season: number,
    week: number,
  ): Promise<Pick[]> {
    let query: SelectQueryBuilder<Pick> = this.pickRepository
      .createQueryBuilder('pick')
      .leftJoin('pick.user', 'user')
      .leftJoinAndSelect('pick.game', 'game')
      .where('user.id = :userId', { userId });

    if (season) {
      query = query.andWhere('game.season = :season', { season });

      if (week) {
        query = query.andWhere('game.week = :week', { week });
      }
    }

    return await query.getMany();
  }

  async savePick(pick: Pick): Promise<Pick> {
    return this.pickRepository.save(pick);
  }

  async savePicks(picks: Pick[]): Promise<Pick[]> {
    const { user, game } = picks[0];
    const currentPicks: Pick[] = await this.getPicksByUser(
      user.id,
      game.season,
      game.week,
    );
    await this.pickValidatorService.validatePicks(
      picks,
      currentPicks,
      user,
      game,
    );
    return await this.pickRepository.save(picks);
  }
}
