import { ChattingRepository } from '../chatting/chatting.repository';
import { ChatRoom, NestedChatRoomInfo } from '../chatting/items/chat.list';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { User } from '../user/entities/user.interface';
import { UserRepository } from '../user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatInfoService {
  constructor(
    private readonly chattingRepository: ChattingRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly userRepository: UserRepository,
    private readonly tutoringRepository: TutoringRepository,
  ) {}

  async findOne(chattingRoomId: string, userId: string) {
    try {
      const room = await this.chattingRepository.findOne(chattingRoomId);
      if (room.studentId == userId || room.teacherId == userId) {
        const userInfo = await this.userRepository.get(userId);
        const questionInfo = await this.questionRepository.getInfo(
          room.questionId,
        );
        const roomInfo = await this.makeChatItem(
          { roomInfo: room, questionInfo },
          userInfo,
        );
        return new Success('채팅방 정보를 불러왔습니다.', roomInfo);
      } else {
        return new Fail('해당 채팅방에 대한 권한이 없습니다.');
      }
    } catch (error) {
      return new Fail('해당 채팅방 정보가 없습니다.');
    }
  }

  async makeChatItem(nestChatRoom: NestedChatRoomInfo, userInfo: User) {
    //DB의 질문 정보와 채팅 정보를 API를 호출 한 사람에 맞게 가공한다.

    const { roomInfo, questionInfo } = nestChatRoom;

    let opponentInfo: User | undefined;

    try {
      if (userInfo.role == 'student') {
        opponentInfo = await this.userRepository.get(roomInfo.teacherId);
      } else {
        opponentInfo = await this.userRepository.get(roomInfo.studentId);
      }
    } catch (error) {
      //유저 정보를 가져오는데 실패한 경우.
    }

    const chatRoom: ChatRoom = {
      id: roomInfo.id,
      status: roomInfo.status,
      roomImage: opponentInfo.profileImage,
      questionId: questionInfo.id,
      isSelect: questionInfo.isSelect,
      opponentId: opponentInfo?.id,
      questionInfo: questionInfo,
      title: opponentInfo?.name,
    };

    try {
      if (questionInfo.tutoringId != null) {
        const tutoringInfo = await this.tutoringRepository.get(
          questionInfo.tutoringId,
        );
        chatRoom.reservedStart = tutoringInfo.reservedStart;
      }
    } catch (error) {}

    return chatRoom;
  }
}
