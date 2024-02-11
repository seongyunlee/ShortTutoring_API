import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisModule, UserModule],
  controllers: [FcmController],
  providers: [FcmService],
})
export class FcmModule {}
