import { AccessToken } from '../auth/entities/auth.entity';
import {
  TeacherOperation,
  UserOperation,
} from '../user/descriptions/user.operation';
import { UserParam } from '../user/descriptions/user.param';
import { UserResponse } from '../user/descriptions/user.response';
import { TutoringOperation } from './descriptions/tutoring.operation';
import { TutoringResponse } from './descriptions/tutoring.response';
import { CreateReviewDto } from './dto/create-review.dto';
import { AppointTutoringDto } from './dto/create-tutoring.dto';
import { TutoringService } from './tutoring.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tutoring')
@Controller('tutoring')
export class TutoringController {
  constructor(private readonly tutoringService: TutoringService) {}

  @ApiBearerAuth('Authorization')
  @Get('finish/:tutoringId')
  @ApiOperation(TutoringOperation.finish)
  finish(@Param('tutoringId') tutoringId: string) {
    return this.tutoringService.finish(tutoringId);
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.info)
  @Get('info/:questionId')
  info(@Param('questionId') questionId: string, @Headers() headers: Headers) {
    return this.tutoringService.info(questionId, AccessToken.userId(headers));
  }

  @ApiTags('Tutoring')
  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.classroomInfo)
  @Get('classroom/info/:questionId')
  classroomInfo(
    @Param('questionId') questionId: string,
    @Headers() headers: Headers,
  ) {
    return this.tutoringService.classrroomInfo(
      questionId,
      AccessToken.userId(headers),
    );
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.start)
  @ApiResponse(TutoringResponse.classroomInfo)
  @Get('start/:tutoringId')
  start(@Param('tutoringId') tutoringId: string, @Headers() headers: Headers) {
    return this.tutoringService.startTutoring(
      AccessToken.userId(headers),
      tutoringId,
    );
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.decline)
  @Get('decline/:tutoringId')
  decline(
    @Param('tutoringId') chattingId: string,
    @Headers() headers: Headers,
  ) {
    return this.tutoringService.decline(
      chattingId,
      AccessToken.userId(headers),
    );
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.appoint)
  @Post('appoint/:questionId')
  appoint(
    @Param('questionId') questionId: string,
    @Body() appointTutoringDto: AppointTutoringDto,
  ) {
    return this.tutoringService.reserveTutoring(
      questionId,
      appointTutoringDto.startTime,
      appointTutoringDto.endTime,
    );
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.createReview)
  @ApiResponse(TutoringResponse.createReview)
  @Post('review/create/:tutoringId')
  createReview(
    @Param('tutoringId') tutoringId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Headers() headers: Headers,
  ) {
    return this.tutoringService.createReview(
      AccessToken.userId(headers),
      tutoringId,
      createReviewDto,
    );
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.tutoringList)
  @Get('user/tutoring/list')
  @ApiResponse(UserResponse.tutoringList)
  tutoringList(@Headers() headers: Headers) {
    return this.tutoringService.tutoringList(AccessToken.userId(headers));
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.teacherId)
  @ApiOperation(TeacherOperation.reviewList)
  @Get('teacher/review/list/:teacherId')
  reviewList(
    @Headers() headers: Headers,
    @Param('teacherId') teacherId: string,
  ) {
    return this.tutoringService.reviewList(teacherId);
  }
}
