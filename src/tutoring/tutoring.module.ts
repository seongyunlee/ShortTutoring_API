import { AgoraModule } from '../agora/agora.module';
import { ChattingRepository } from '../chatting/chatting.repository';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionRepository } from '../question/question.repository';
import { SocketModule } from '../socket/socket.module';
import { UploadService } from '../upload/upload.service';
import { UserRepository } from '../user/user.repository';
import { TutoringController } from './tutoring.controller';
import { TutoringRepository } from './tutoring.repository';
import { TutoringService } from './tutoring.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule, SocketModule],
  controllers: [TutoringController],
  providers: [
    TutoringService,
    TutoringRepository,
    QuestionRepository,
    UserRepository,
    UploadService,
    ChattingRepository,
  ],
})
export class TutoringModule {}
