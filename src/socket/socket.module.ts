import { AuthModule } from '../auth/auth.module';
import { ChattingModule } from '../chatting/chatting.module';
import { dynamooseModule } from '../config.dynamoose';
import { redisSubProvider } from '../config.redis';
import { FcmModule } from '../fcm/fcm.module';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    dynamooseModule,
    RedisModule,
    AuthModule,
    UserModule,
    ChattingModule,
    FcmModule,
  ],
  providers: [SocketService, SocketGateway, redisSubProvider],
  exports: [SocketService],
})
export class SocketModule {}
