import { dynamooseModule } from '../config.dynamoose';
import { UploadService } from '../upload/upload.service';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { EventService } from './event.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule],
  controllers: [EventController],
  providers: [EventService, EventRepository, UploadService],
})
export class EventModule {}
