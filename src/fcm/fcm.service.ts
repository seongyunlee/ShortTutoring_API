import { RedisRepository } from '../redis/redis.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FcmService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async setFCMToken(userId: any, fcmToken: string) {
    try {
      await this.redisRepository.setFCMToken(userId, fcmToken);
      return '성공적으로 FCM 토큰을 저장했습니다.';
    } catch (error) {
      return error.message;
    }
  }
}
