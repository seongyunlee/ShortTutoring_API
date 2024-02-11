import { AuthModule } from '../auth/auth.module';
import { dynamooseModule } from '../config.dynamoose';
import { RedisModule } from '../redis/redis.module';
import { UploadModule } from '../upload/upload.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AuthModule, RedisModule, UploadModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService],
})
export class UserModule {}
