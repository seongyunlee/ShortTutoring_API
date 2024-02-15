import { RedisModule } from '../redis/redis.module';
import { TutoringModule } from '../tutoring/tutoring.module';
import { UserModule } from '../user/user.module';
import { OnlineController } from './online.controller';
import { OnlineService } from './online.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisModule, TutoringModule, UserModule],
  controllers: [OnlineController],
  providers: [OnlineService],
})
export class OnlineModule {}
