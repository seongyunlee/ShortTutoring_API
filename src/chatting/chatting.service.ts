import { FcmService } from '../fcm/fcm.service';
import { RedisRepository } from '../redis/redis.repository';
import { UserRepository } from '../user/user.repository';
import { ChattingRepository } from './chatting.repository';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { Message } from './entities/chatting.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChattingService {
  constructor(
    private readonly chattingRepository: ChattingRepository,
    private readonly userRepository: UserRepository,
    private readonly redisRepository: RedisRepository,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * 다른 사용자에게 메시지를 전송하는 메소드 , 연결된 소켓이 있으면 소켓 전송, 레디스에 브로드캐스트, DynamoDB에 저장
   * @param senderId 메시지를 보내는 사용자의 ID
   * @param receiverId 메시지를 받는 사용자의 ID
   * @param chattingId 메시지를 보내는 채팅방의 ID
   * @param format 메시지의 형식 (text, appoint-request , ...)
   * @param body 메시지의 내용 (JSON 형식 ex: { "text" : "안녕하세요" } )
   */
  async sendMessageToUser(
    senderId: string,
    receiverId: string,
    chattingId: string,
    format: string,
    body: string,
  ) {
    const message: Message = {
      sender: senderId,
      format,
      body,
      createdAt: new Date().toISOString(),
    };
    const receiverSocketId = await this.redisRepository.getSocketId(receiverId);

    // 레디스 브로드캐스트
    await this.redisRepository.publish(
      receiverSocketId,
      JSON.stringify({ chattingId, message }),
    );

    // DynamoDB에 메시지 저장
    await this.chattingRepository.sendMessage(
      chattingId,
      senderId,
      format,
      body,
    );
  }

  async sendMessageToBothUser(
    senderId: string,
    receiverId: string,
    chattingId: string,
    format: string,
    body: string,
  ) {
    const message: Message = {
      sender: senderId,
      format,
      body,
      createdAt: new Date().toISOString(),
    };
    const receiverSocketId = await this.redisRepository.getSocketId(receiverId);

    await this.fcmService.sendPushMessageToUser(
      senderId,
      receiverId,
      chattingId,
      format,
      body,
    );

    await this.fcmService.sendPushMessageToUser(
      senderId,
      senderId,
      chattingId,
      format,
      body,
    );

    const senderSocketId = await this.redisRepository.getSocketId(senderId);

    if (receiverSocketId != null) {
      await this.redisRepository.publish(
        receiverSocketId,
        JSON.stringify({ chattingId, message }),
      );
    }

    if (senderSocketId != null) {
      await this.redisRepository.publish(
        senderSocketId,
        JSON.stringify({ chattingId, message }),
      );
    }
  }

  /*
  async create(senderId: string, createChattingDto: CreateChattingDto) {
    const receiverId = createChattingDto.roomId;
    const areConnected = await this.chattingRepository.areConnected(
      senderId,
      receiverId,
    );

    if (areConnected) {
      return new Fail('이미 채팅방이 존재합니다.');
    } else {
      return await this.chattingRepository.create(senderId, receiverId);
    }
  }

   */

  /*
    async sendMessage(senderId: string, roomId:string, sendMessageDto: SendMessageDto) {
      const receiverId = sendMessageDto.roomId;
      const areConnected = await this.chattingRepository.areConnected(
        senderId,
        receiverId,
      );

      if (areConnected) {
        return new Success(
          '성공적으로 메시지를 보냈습니다.',
          await this.chattingRepository.sendMessage(
            senderId,
            receiverId,
            sendMessageDto.message,
          ),
        );
      } else {
        return new Fail('채팅방이 존재하지 않습니다.');
      }
    }
    */

  async findAll() {
    return await this.chattingRepository.findAll();
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
