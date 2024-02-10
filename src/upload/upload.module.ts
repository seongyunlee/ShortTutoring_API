import { UploadService } from './upload.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
