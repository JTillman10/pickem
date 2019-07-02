import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { getPostgresConnectionOptions } from './config';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getPostgresConnectionOptions()),
    // TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
