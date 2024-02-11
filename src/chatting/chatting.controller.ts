import { ChattingService } from './chatting.service';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('chatting')
@ApiTags('Chatting')
@ApiBearerAuth('Authorization')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) {}
}
