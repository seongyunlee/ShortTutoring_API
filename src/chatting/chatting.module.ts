import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';
import { FcmModule } from '../fcm/fcm.module';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { ChattingRepository } from './chatting.repository';
import { ChattingService } from './chatting.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule, UserModule, RedisModule, FcmModule],
  controllers: [],
  providers: [ChattingService, ChattingRepository],
  exports: [ChattingRepository, ChattingService],
})
export class ChattingModule {}
