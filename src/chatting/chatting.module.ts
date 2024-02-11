import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from '../user/user.module';
import { ChattingController } from './chatting.controller';
import { ChattingRepository } from './chatting.repository';
import { ChattingService } from './chatting.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule, UserModule, SocketModule],
  controllers: [ChattingController],
  providers: [ChattingService, ChattingRepository],
  exports: [ChattingRepository],
})
export class ChattingModule {}
