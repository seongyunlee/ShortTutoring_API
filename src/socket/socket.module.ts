import { AuthModule } from '../auth/auth.module';
import { ChattingRepository } from '../chatting/chatting.repository';
import { dynamooseModule } from '../config.dynamoose';
import { redisSubProvider } from '../config.redis';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, RedisModule, AuthModule, UserModule],
  providers: [
    SocketService,
    SocketGateway,
    redisSubProvider,
    ChattingRepository,
  ],
  exports: [SocketService],
})
export class SocketModule {}
