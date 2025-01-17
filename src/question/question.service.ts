import { ChattingRepository } from '../chatting/chatting.repository';
import { ChattingService } from '../chatting/chatting.service';
import { Fail, Success } from '../response';
import { SocketService } from '../socket/socket.service';
import { UserRepository } from '../user/user.repository';
import {
  CreateNormalQuestionDto,
  CreateSelectedQuestionDto,
} from './dto/create-question.dto';
import { Question } from './entities/question.interface';
import { QuestionRepository } from './question.repository';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly chattingRepository: ChattingRepository,
    private readonly chattingService: ChattingService,
    private readonly userRepository: UserRepository,
    private readonly socketService: SocketService,
  ) {}

  /**
   * 학생의 질문을 생성합니다.
   * @param userId
   * @param createQuestionDto 질문 생성 정보
   * @returns 생성된 질문의 ID
   */
  async createNormal(
    userId: string,
    createQuestionDto: CreateNormalQuestionDto,
  ) {
    try {
      const balance = await this.userRepository.getCoin(userId);
      if (balance < 1) {
        return new Fail('코인이 부족합니다.');
      }

      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );
      const question: Question =
        await this.questionRepository.createNormalQuestion(
          questionId,
          userId,
          createQuestionDto,
          problemImages,
        );
      await this.userRepository.useCoin(userId);

      return new Success('질문이 생성되었습니다.', question);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async createSelected(
    userId: string,
    teacherId: string,
    createQuestionDto: CreateSelectedQuestionDto,
  ) {
    try {
      const balance = await this.userRepository.getCoin(userId);
      if (balance < 1) {
        return new Fail('코인이 부족합니다.');
      }

      const questionId = uuid();
      const problemImages = await this.questionRepository.problemImages(
        questionId,
        createQuestionDto,
      );

      try {
        await this.userRepository.get(teacherId);
      } catch (e) {
        return new Fail('해당 선생님을 찾을 수 없습니다.');
      }

      const question: Question =
        await this.questionRepository.createSelectedQuestion(
          questionId,
          userId,
          teacherId,
          createQuestionDto,
          problemImages,
        );

      const chatRoomId = await this.chattingRepository.makeChatRoom(
        teacherId,
        userId,
        questionId,
      );
      await this.userRepository.useCoin(userId); // TODO : transaction 으로 변경 고려

      await this.userRepository.joinChattingRoom(userId, chatRoomId);
      await this.userRepository.joinChattingRoom(teacherId, chatRoomId);

      const messageImage = problemImages[createQuestionDto.mainImageIndex];

      const problemMessage = {
        image: messageImage,
        description: createQuestionDto.description,
        questionId: questionId,
        subTitle: `${createQuestionDto.schoolLevel} ${createQuestionDto.schoolSubject}`,
      };
      const requestMessage = {
        startDateTime: createQuestionDto.requestTutoringStartTime.toISOString(),
      };

      await this.chattingService.sendMessageToBothUser(
        userId,
        teacherId,
        chatRoomId,
        'problem-image',
        JSON.stringify(problemMessage),
      );
      await this.chattingService.sendMessageToBothUser(
        userId,
        teacherId,
        chatRoomId,
        'appoint-request',
        JSON.stringify(requestMessage),
      );

      return new Success('질문이 생성되었습니다.', {
        ...question,
        chattingId: chatRoomId,
      });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getQuestionInfo(questionId: string) {
    try {
      const info = await this.questionRepository.getInfo(questionId);
      return new Success('질문 정보를 가져왔습니다.', info);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async delete(userId: string, questionId: string) {
    try {
      await this.questionRepository.cancelQuestion(userId, questionId);
      await this.userRepository.earnCoin(userId);
      return new Success('질문이 삭제되었습니다.', { questionId });
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getPendingNormalQuestions() {
    try {
      const questions: Question[] =
        await this.questionRepository.getByStatusAndType('pending', false);
      return new Success('질문 목록을 불러왔습니다.', questions);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async getMyQuestions(userId: string, status: string, type: string) {
    try {
      const user = await this.userRepository.get(userId);
      if (user.role !== 'student') {
        return new Fail('학생 사용자가 아닙니다');
      }

      const questions = await this.questionRepository.getMyQuestions(
        userId,
        status,
        type,
      );
      return new Success('질문 목록을 불러왔습니다.', questions);
    } catch (error) {
      return new Fail('사용자의 질문 목록을 불러오는데 실패했습니다.');
    }
  }
}
