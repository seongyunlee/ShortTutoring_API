import { AgoraModule } from '../agora/agora.module';
import { ChattingModule } from '../chatting/chatting.module';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionModule } from '../question/question.module';
import { SocketModule } from '../socket/socket.module';
import { UploadModule } from '../upload/upload.module';
import { UserModule } from '../user/user.module';
import { TutoringController } from './tutoring.controller';
import { TutoringRepository } from './tutoring.repository';
import { TutoringService } from './tutoring.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    dynamooseModule,
    AgoraModule,
    SocketModule,
    QuestionModule,
    UploadModule,
    UserModule,
    ChattingModule,
  ],
  controllers: [TutoringController],
  providers: [TutoringService, TutoringRepository],
  exports: [TutoringRepository],
})
export class TutoringModule {}
