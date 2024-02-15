import { AgoraModule } from '../agora/agora.module';
import { ChattingModule } from '../chatting/chatting.module';
import { dynamooseModule } from '../config.dynamoose';
import { QuestionModule } from '../question/question.module';
import { SocketModule } from '../socket/socket.module';
import { TutoringModule } from '../tutoring/tutoring.module';
import { UserModule } from '../user/user.module';
import { OfferController } from './offer.controller';
import { OfferRepository } from './offer.repository';
import { OfferService } from './offer.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    dynamooseModule,
    QuestionModule,
    ChattingModule,
    AgoraModule,
    UserModule,
    TutoringModule,
    SocketModule,
  ],
  controllers: [OfferController],
  providers: [OfferService, OfferRepository],
})
export class OfferModule {}
