import { dynamooseModule } from '../config.dynamoose';
import { UploadModule } from '../upload/upload.module';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, UploadModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
