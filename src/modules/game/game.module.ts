import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { ScraperService } from './scraper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GameService, ScraperService],
  controllers: [GameController],
})
export class GameModule {}
