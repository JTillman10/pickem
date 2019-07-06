import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { getPostgresConnectionOptions } from './config';
import { GameModule } from './modules/game/game.module';
import { PicksModule } from './modules/pick/pick.module';
import { FrontendMiddleware } from './middleware/frontend/frontend.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(getPostgresConnectionOptions()),
    // TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    GameModule,
    PicksModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FrontendMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
  }
}
