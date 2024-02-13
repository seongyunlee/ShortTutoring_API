import { RedisRepository } from '../redis/redis.repository';
import { Injectable } from '@nestjs/common';

//import { getMessaging } from 'firebase-admin/lib/messaging';

@Injectable()
export class FcmService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async setFCMToken(userId: any, fcmToken: string) {
    try {
      //await this.redisRepository.setFCMToken(userId, fcmToken);
      return '성공적으로 FCM 토큰을 저장했습니다.';
    } catch (error) {
      return error.message;
    }
  }

  async sendPushMessageToUser(
    senderId: string,
    receiverId: string,
    chattingId: string,
    format: string,
    body: string,
  ) {
    const receiverFCMToken = await this.redisRepository.getFCMToken(receiverId);
    /*
    if (receiverFCMToken != null) {
      await getMessaging().send({
        data: {
          chattingId,
          sender: senderId,
          format,
          body,
          createdAt: new Date().toISOString(),
          type: 'chatting',
        },
        token: receiverFCMToken,
      });
    }*/
    return;
  }
}
