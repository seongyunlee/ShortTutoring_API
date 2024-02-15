import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ChatInfoModule } from './chat-info/chat-info.module';
import { ChattingModule } from './chatting/chatting.module';
import { DynamooseConfig } from './config.dynamoose';
import { EventModule } from './event/event.module';
import { FollowModule } from './follow/follow.module';
import { OfferModule } from './offer/offer.module';
import { OnlineModule } from './online/online.module';
import { QuestionModule } from './question/question.module';
import { TutoringModule } from './tutoring/tutoring.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    AuthModule,
    UserModule,
    QuestionModule,
    OfferModule,
    UploadModule,
    TutoringModule,
    ChattingModule,
    EventModule,
    OnlineModule,
    FollowModule,
    ChatInfoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
