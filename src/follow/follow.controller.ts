import { AccessToken } from '../auth/entities/auth.entity';
import { UserOperation } from '../user/descriptions/user.operation';
import { UserParam } from '../user/descriptions/user.param';
import { UserResponse } from '../user/descriptions/user.response';
import { FollowService } from './follow.service';
import { Controller, Get, Headers, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.follow)
  @Get('student/follow/:userId')
  follow(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.followService.follow(AccessToken.userId(headers), userId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.unfollow)
  @Get('student/unfollow/:userId')
  unfollow(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.followService.unfollow(AccessToken.userId(headers), userId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.following)
  @Get('student/following')
  following(@Headers() headers: Headers) {
    return this.followService.following(AccessToken.userId(headers));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherFollowers)
  @ApiResponse(UserResponse.followInfo)
  @Get('user/followers/:userId')
  otherFollowers(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.followService.otherFollowers(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherFollowing)
  @ApiResponse(UserResponse.followInfo)
  @Get('user/following/:userId')
  otherFollowing(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.followService.otherFollowing(userId);
  }
}
