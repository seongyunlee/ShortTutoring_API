import { AccessToken } from '../auth/entities/auth.entity';
import { ChattingOperation } from '../chatting/description/chatting.operation';
import { ChatInfoService } from './chat-info.service';
import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chat-info')
export class ChatInfoController {
  constructor(private readonly chattingInfoService: ChatInfoService) {}

  @ApiOperation(ChattingOperation.list)
  @Get('/:chattingId')
  getChatRoomInfo(
    @Param('chattingId') chattingId: string,
    @Headers() headers: Headers,
  ) {
    return this.chattingInfoService.findOne(
      chattingId,
      AccessToken.userId(headers),
    );
  }
}
