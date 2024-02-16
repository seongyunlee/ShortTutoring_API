import { ActiveUser } from '../common/decorators/active-user.decorator';
import { SetFCMTokenUserDto } from '../user/dto/setFCMToken-user.dto';
import { FcmService } from './fcm.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class FcmController {
  constructor(private readonly fcmService: FcmService) {}

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @Post('fcmToken')
  setFCMToken(
    @ActiveUser('userId') userId: string,
    @Body() setFCMTokenUserDto: SetFCMTokenUserDto,
  ) {
    return this.fcmService.setFCMToken(userId, setFCMTokenUserDto.fcmToken);
  }
}
