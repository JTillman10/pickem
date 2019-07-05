import { Module } from '@nestjs/common';

import { PickController } from './pick.controller';
import { PickService } from './pick.service';
import { PickValidatorService } from './pick-validator.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pick } from './pick.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Pick]),
  ],
  controllers: [PickController],
  providers: [PickService, PickValidatorService],
  exports: [PickService],
})
export class PicksModule {}
