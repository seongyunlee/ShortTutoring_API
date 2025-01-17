import { AuthRepository } from '../auth/auth.repository';
import { ChattingRepository } from '../chatting/chatting.repository';
import { RedisRepository } from '../redis/redis.repository';
import { UserRepository } from '../user/user.repository';
import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly redisRepository: RedisRepository,
    private readonly userRepository: UserRepository,
    private readonly chattingRepository: ChattingRepository,
  ) {}

  async getUserFromAuthorization(headers: any) {
    const { authorization } = headers;

    try {
      const { userId } = this.authRepository.decodeJwt(
        authorization.replace('Bearer ', ''),
      );

      return await this.userRepository.get(userId);
    } catch (error) {
      return null;
    }
  }
}
