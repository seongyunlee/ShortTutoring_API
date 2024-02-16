import { ActiveUser } from '../common/decorators/active-user.decorator';
import { QuestionOperation } from './descriptions/question.operation';
import { QuestionQuery } from './descriptions/question.query';
import { QuestionResponse } from './descriptions/question.response';
import {
  CreateNormalQuestionDto,
  CreateSelectedQuestionDto,
} from './dto/create-question.dto';
import { QuestionService } from './question.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.createNormalQuestion)
  @ApiResponse(QuestionResponse.create.success)
  @Post('student/question/create/normal')
  createNormal(
    @ActiveUser('userId') userId: string,
    @Body() createQuestionDto: CreateNormalQuestionDto,
  ) {
    return this.questionService.createNormal(userId, createQuestionDto);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.createSelectedQuestion)
  @ApiResponse(QuestionResponse.create.success)
  @Post('student/question/create/selected')
  createSelected(
    @ActiveUser('userId') userId: string,
    @Body() createQuestionDto: CreateSelectedQuestionDto,
  ) {
    return this.questionService.createSelected(
      userId,
      createQuestionDto.requestTeacherId,
      createQuestionDto,
    );
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.delete)
  @Get('student/question/delete/:questionId')
  delete(
    @Param('questionId') questionId: string,
    @ActiveUser('userId') userId: string,
  ) {
    return this.questionService.delete(userId, questionId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.getMyQuestions)
  @ApiQuery(QuestionQuery.getMyQuestions.type)
  @ApiQuery(QuestionQuery.getMyQuestions.status)
  @Get('student/question/list/my')
  getMyQuestions(
    @Query('status') status: string,
    @Query('type') type: string,
    @ActiveUser('userId') userId: string,
  ) {
    return this.questionService.getMyQuestions(userId, status, type);
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.list)
  @Get('teacher/question/list')
  list() {
    return this.questionService.getPendingNormalQuestions();
  }

  @ApiTags('Question')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.info)
  @Get('question/info/:questionId')
  getQuestionInfo(@Param('questionId') questionId: string) {
    return this.questionService.getQuestionInfo(questionId);
  }
}
