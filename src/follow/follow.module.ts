import { TutoringModule } from '../tutoring/tutoring.module';
import { UserModule } from '../user/user.module';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, TutoringModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
