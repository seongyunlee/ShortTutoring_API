import { ChattingModule } from '../chatting/chatting.module';
import { dynamooseModule } from '../config.dynamoose';
import { SocketModule } from '../socket/socket.module';
import { UploadModule } from '../upload/upload.module';
import { UserModule } from '../user/user.module';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    dynamooseModule,
    UserModule,
    UploadModule,
    ChattingModule,
    SocketModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionRepository],
})
export class QuestionModule {}
