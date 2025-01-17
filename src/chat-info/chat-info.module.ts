import { ChattingModule } from '../chatting/chatting.module';
import { QuestionModule } from '../question/question.module';
import { TutoringModule } from '../tutoring/tutoring.module';
import { UserModule } from '../user/user.module';
import { ChatInfoController } from './chat-info.controller';
import { ChatInfoService } from './chat-info.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ChattingModule, QuestionModule, UserModule, TutoringModule],
  controllers: [ChatInfoController],
  providers: [ChatInfoService],
})
export class ChatInfoModule {}
