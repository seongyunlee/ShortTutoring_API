import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ChatInfoModule } from './chat-info/chat-info.module';
import { ChattingModule } from './chatting/chatting.module';
import { DBExceptionFilter } from './common/exception/db-exception.filter';
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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import { DynamooseModule } from 'nestjs-dynamoose';
import * as process from 'process';
import * as winston from 'winston';
import * as WinstonCloudwatch from 'winston-cloudwatch';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('Nest'),
          ),
        }),
        new WinstonCloudwatch({
          level: 'info',
          logGroupName: 'short-tutoring',
          logStreamName: 'short-tutoring',
          awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
          awsRegion: process.env.AWS_REGION,
          awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
        }),
      ],
    }),
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
    {
      provide: APP_FILTER,
      useClass: DBExceptionFilter,
    },
  ],
})
export class AppModule {}
