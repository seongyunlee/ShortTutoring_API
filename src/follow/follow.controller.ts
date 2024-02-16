import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserOperation } from '../user/descriptions/user.operation';
import { UserParam } from '../user/descriptions/user.param';
import { UserResponse } from '../user/descriptions/user.response';
import { FollowService } from './follow.service';
import { Controller, Get, Param } from '@nestjs/common';
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
  @Get('following/:userId')
  follow(
    @ActiveUser('userId') activeUserId: string,
    @Param('userId') userId: string,
  ) {
    return this.followService.follow(activeUserId, userId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.unfollow)
  @Get('unfollowing/:userId')
  unfollow(
    @ActiveUser('userId') activeUserId: string,
    @Param('userId') userId: string,
  ) {
    return this.followService.unfollow(activeUserId, userId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.following)
  @Get('followings')
  followings(@ActiveUser('userId') userId: string) {
    return this.followService.following(userId);
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.followers)
  @Get('followers')
  followers(@ActiveUser('userId') userId: string) {
    return this.followService.followers(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherFollowers)
  @ApiResponse(UserResponse.followInfo)
  @Get('followers/:userId')
  otherFollowers(
    @ActiveUser('userId') activeUserId: string,
    @Param('userId') userId: string,
  ) {
    return this.followService.otherFollowers(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherFollowing)
  @ApiResponse(UserResponse.followInfo)
  @Get('followings/:userId')
  otherFollowing(@Param('userId') userId: string) {
    return this.followService.otherFollowing(userId);
  }
}
