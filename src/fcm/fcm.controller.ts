import { AccessToken } from '../auth/entities/auth.entity';
import { SetFCMTokenUserDto } from '../user/dto/setFCMToken-user.dto';
import { FcmService } from './fcm.service';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @Post('fcmToken')
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
