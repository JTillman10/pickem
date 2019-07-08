import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { getPostgresConnectionOptions } from './config';
import { GameModule } from './modules/game/game.module';
import { PicksModule } from './modules/pick/pick.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getPostgresConnectionOptions()),
    // TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    GameModule,
    PicksModule,
  ],
})
export class AppModule {}
