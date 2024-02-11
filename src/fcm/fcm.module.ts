import { RedisModule } from '../redis/redis.module';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisModule],
  controllers: [FcmController],
  providers: [FcmService],
})
export class FcmModule {}
