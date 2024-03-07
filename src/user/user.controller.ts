import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserOperation } from './descriptions/user.operation';
import { UserParam } from './descriptions/user.param';
import { UserResponse } from './descriptions/user.response';
import { CreateStudentDto, CreateTeacherDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Student')
  @ApiOperation(UserOperation.signup.student)
  @ApiCreatedResponse(UserResponse.signup.student)
  @Public()
  @Post('student/signup')
  signupStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.userService.signupStudent(createStudentDto);
  }

  @ApiTags('Teacher')
  @ApiOperation(UserOperation.signup.teacher)
  @ApiCreatedResponse(UserResponse.signup.teacher)
  @Public()
  @Post('teacher/signup')
  signupTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.userService.signupTeacher(createTeacherDto);
  }

  @ApiTags('User')
  @ApiOperation(UserOperation.login)
  @ApiResponse(UserResponse.login)
  @Post('user/login')
  @Public()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.profile)
  @ApiResponse(UserResponse.me.profile)
  @Get('user/profile')
  profile(@ActiveUser('userId') userId: string) {
    return this.userService.profile(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherProfile)
  @ApiResponse(UserResponse.profile)
  @Get('user/profile/:userId')
  otherProfile(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherProfile(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.updateProfile)
  @ApiResponse(UserResponse.me.updateProfile)
  @Post('user/profile/update')
  update(
    @ActiveUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.withdraw)
  @ApiResponse(UserResponse.me.withdraw)
  @Get('user/withdraw')
  withdraw(@ActiveUser() user: ActiveUserData) {
    return this.userService.withdraw(user.userId, user.authId, user.vendor);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.bestTeacher)
  @Get('user/list/teacher/best')
  getBestTeachers(@ActiveUser('userId') userId: string) {
    return this.userService.getBestTeachers(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @Get('user/receiveFreeCoin')
  receiveFreeCoin(@ActiveUser('userId') userId: string) {
    throw new HttpException('가짜 에러 터뜨리기', HttpStatus.BAD_REQUEST);
    return this.userService.receiveFreeCoin(userId);
  }
}
