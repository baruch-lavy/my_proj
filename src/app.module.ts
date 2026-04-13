import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './modules/cats.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .exclude(
      { path: 'cats/custom', method: RequestMethod.GET },
    )
    .forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })

    // alternative way to apply middleware to a specific controller
    // .forRoutes(AppController);
  }
}
