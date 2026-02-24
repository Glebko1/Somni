import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CbtModule } from './cbt/cbt.module';
import { CommonModule } from './common/common.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { CronModule } from './cron/cron.module';
import { DreamsInterpretationModule } from './dreams-interpretation/dreams-interpretation.module';
import { FriendsRankingModule } from './friends-ranking/friends-ranking.module';
import { GamificationModule } from './gamification/gamification.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SleepModule } from './sleep/sleep.module';
import { SomnikModule } from './somnik/somnik.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CommonModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SleepModule,
    CbtModule,
    GamificationModule,
    SomnikModule,
    SubscriptionModule,
    FriendsRankingModule,
    DreamsInterpretationModule,
    NotificationsModule,
    CronModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
