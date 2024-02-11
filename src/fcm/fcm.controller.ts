import { AccessToken } from '../auth/entities/auth.entity';
import { RedisRepository } from '../redis/redis.repository';
import { SetFCMTokenUserDto } from '../user/dto/setFCMToken-user.dto';
import { UserService } from '../user/user.service';
import { FcmService } from './fcm.service';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('fcm')
export class FcmController {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly userService: UserService,
    private readonly fcmService: FcmService,
  ) {}

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @Post('user/fcmToken')
  setFCMToken(
    @Headers() headers: Headers,
    @Body() setFCMTokenUserDto: SetFCMTokenUserDto,
  ) {
    return this.fcmService.setFCMToken(
      AccessToken.userId(headers),
      setFCMTokenUserDto.fcmToken,
    );
  }
}
