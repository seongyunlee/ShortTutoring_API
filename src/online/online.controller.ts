import { AccessToken } from '../auth/entities/auth.entity';
import { UserOperation } from '../user/descriptions/user.operation';
import { UserResponse } from '../user/descriptions/user.response';
import { OnlineService } from './online.service';
import { Controller, Get, Headers } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class OnlineController {
  constructor(private readonly onlineService: OnlineService) {}

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.onlineTeacher)
  @ApiResponse(UserResponse.onlineTeacher)
  @Get('user/list/teacher/online')
  getOnlineTeachers(@Headers() headers: Headers) {
    return this.onlineService.getOnlineTeachers(AccessToken.userId(headers));
  }
}
