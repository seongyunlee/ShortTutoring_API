import { ChattingOperation } from '../chatting/description/chatting.operation';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ChatInfoService } from './chat-info.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chatting')
export class ChatInfoController {
  constructor(private readonly chattingInfoService: ChatInfoService) {}

  @ApiOperation(ChattingOperation.list)
  @Get('/:chattingId')
  getChatRoomInfo(
    @Param('chattingId') chattingId: string,
    @ActiveUser('userId') userId: string,
  ) {
    return this.chattingInfoService.findOne(chattingId, userId);
  }
}
