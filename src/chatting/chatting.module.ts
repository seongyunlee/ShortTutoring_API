import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from '../user/user.module';
import { ChattingRepository } from './chatting.repository';
import { ChattingService } from './chatting.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule, UserModule, SocketModule],
  controllers: [],
  providers: [ChattingService, ChattingRepository],
  exports: [ChattingRepository],
})
export class ChattingModule {}
