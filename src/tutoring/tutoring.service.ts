import { AgoraService, WhiteBoardChannelInfo } from '../agora/agora.service';
import { ChattingRepository } from '../chatting/chatting.repository';
import { ChattingStatus } from '../chatting/entities/chatting.interface';
import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { SocketService } from '../socket/socket.service';
import { UploadService } from '../upload/upload.service';
import {
  StudentListing,
  TeacherListing,
  TutoringHistory,
  UserListing,
} from '../user/entities/user.entities';
import { User } from '../user/entities/user.interface';
import { UserRepository } from '../user/user.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { ClassroomInfo, TutoringInfo } from './entities/tutoring.entity';
import { TutoringRepository } from './tutoring.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TutoringService {
  constructor(
    private readonly tutoringRepository: TutoringRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly agoraService: AgoraService,
    private readonly socketService: SocketService,
    private readonly userRepository: UserRepository,
    private readonly chattingRepository: ChattingRepository,
    private readonly uploadRepository: UploadService,
  ) {}

  async finish(tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.finishTutoring(tutoringId);

      /*await this.questionRepository.changeStatus(
        tutoring.questionId,
        'finished',
      );*/

      const { whiteBoardUUID } = tutoring;
      await this.agoraService.disableWhiteBoardChannel(whiteBoardUUID);

      const finishMessage = {
        startAt: tutoring.startedAt,
        endAt: tutoring.endedAt,
      };

      const chatId = await this.chattingRepository.getIdByQuestionAndTeacher(
        tutoring.questionId,
        tutoring.teacherId,
      );

      await this.socketService.sendMessageToBothUser(
        tutoring.teacherId,
        tutoring.studentId,
        chatId,
        'tutoring-finished',
        JSON.stringify(finishMessage),
      );

      await this.userRepository.earnCoin(tutoring.teacherId);

      this.agoraService
        .stopRecord(
          tutoring.recordingResourceId,
          tutoring.recordingSid,
          tutoringId,
        )
        .then(async (result) => {
          try {
            const files = await this.uploadRepository.findRecordFile(
              result.uid,
            );
            await this.tutoringRepository.setRecordingFilePath(
              result.tutoringId,
              files,
            );
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));

      return new Success('과외가 종료되었습니다.', { tutoringId });
    } catch (error) {
      console.log(error);
      return new Fail(`과외를 종료할 수 없습니다.`);
    }
  }

  async reserveTutoring(questionId: string, startTime: Date, endTime: Date) {
    try {
      const question = await this.questionRepository.getInfo(questionId);

      if (question.tutoringId != null)
        return new Fail('이미 과외가 확정되었습니다.');

      const tutoring = await this.tutoringRepository.create(
        questionId,
        question.studentId,
        question.selectedTeacherId,
      );

      await this.questionRepository.setTutoringId(questionId, tutoring.id);

      await this.tutoringRepository.reserveTutoring(
        tutoring.id,
        startTime,
        endTime,
      );

      const reserveConfirmMessage = {
        startTime: startTime.toISOString(),
      };

      const chatRoomId =
        await this.chattingRepository.getIdByQuestionAndTeacher(
          questionId,
          question.selectedTeacherId,
        );
      await this.chattingRepository.changeStatus(
        chatRoomId,
        ChattingStatus.reserved,
      );

      await this.questionRepository.changeStatus(questionId, 'reserved');

      await this.socketService.sendMessageToBothUser(
        question.selectedTeacherId,
        question.studentId,
        chatRoomId,
        'reserve-confirm',
        JSON.stringify(reserveConfirmMessage),
      );

      return new Success('수업 시간이 확정되었습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async classroomChannel(tutoringId: string, userId: string) {
    try {
      const userInfo = await this.userRepository.get(userId);

      const tutoring = await this.tutoringRepository.get(tutoringId);

      if (tutoring == null) {
        throw new Error('존재하지 않는 과외입니다.');
      }

      if (userInfo.role == 'student' && tutoring.status == 'reserved') {
        throw new Error('아직 수업이 시작되지 않았습니다.');
      }
      if (userInfo.role == 'student' && tutoring.status == 'finished') {
        throw new Error('이미 종료된 수업입니다.');
      }
      const whiteBoardToken = await this.agoraService.makeWhiteBoardToken(
        tutoring.whiteBoardUUID,
      );
      const rtcToken = await this.agoraService.makeRtcToken(
        tutoring.questionId,
        userInfo.role == 'teacher' ? 1 : 2,
      );

      const accessInfo: ClassroomInfo = {
        boardAppId: tutoring.whiteBoardAppId,
        rtcAppId: tutoring.RTCAppId,
        boardUUID: tutoring.whiteBoardUUID,
        boardToken: whiteBoardToken,
        rtcToken: rtcToken.token,
        rtcChannel: rtcToken.channel,
        rtcUID: rtcToken.uid,
      };
      return accessInfo;
    } catch (error) {
      return null;
    }
  }

  async classrroomInfo(tutoringId: string, userId: string) {
    try {
      return new Success(
        '수업 정보를 가져왔습니다.',
        await this.classroomChannel(tutoringId, userId),
      );
    } catch (e) {
      return new Fail('수업 정보를 가져오는데 실패했습니다.');
    }
  }

  async info(questionId: string, userId: string) {
    try {
      const question = await this.questionRepository.getInfo(questionId);
      if (
        question.studentId != userId &&
        question.selectedTeacherId != userId
      ) {
        return new Fail('해당 과외 정보를 볼 수 없습니다.');
      }
      const tutoring = await this.tutoringRepository.get(question.tutoringId);
      const tutoringInfo: TutoringInfo = {
        id: tutoring.id,
        questionId: tutoring.questionId,
        studentId: tutoring.studentId,
        teacherId: tutoring.teacherId,
        status: tutoring.status,
        reservedStart: tutoring.reservedStart,
        reservedEnd: tutoring.reservedEnd,
      };
      return new Success('과외 정보를 가져왔습니다.', tutoringInfo);
    } catch (e) {
      return new Fail('해당 과외 정보를 가져오는 데 실패했습니다.');
    }
  }

  async decline(chattingId: string, userId: string) {
    try {
      const chatRoomInfo = await this.chattingRepository.getChatRoomInfo(
        chattingId,
      );
      if (userId != chatRoomInfo.teacherId) {
        return new Fail('해당 과외를 거절할 수 없습니다.');
      }

      await this.questionRepository.changeStatus(chattingId, 'declined');

      await this.chattingRepository.changeStatus(
        chattingId,
        ChattingStatus.declined,
      );

      await this.socketService.sendMessageToBothUser(
        chatRoomInfo.teacherId,
        chatRoomInfo.studentId,
        chattingId,
        'request-decline',
        JSON.stringify({}),
      );

      return new Success('과외를 거절했습니다.');
    } catch (e) {
      console.log(e);
      return new Fail('과외 거절에 실패했습니다.');
    }
  }

  async startTutoring(teacherId: string, tutoringId: string) {
    try {
      const tutoring = await this.tutoringRepository.get(tutoringId);
      if (tutoring.teacherId != teacherId) {
        return new Fail('해당 과외를 진행할 수 없습니다.');
      }
      if (tutoring.status == 'finished') {
        return new Fail('이미 종료된 과외입니다.');
      }

      await this.tutoringRepository.startTutoring(tutoringId);

      const startMessage = {
        text: '과외가 시작되었습니다.',
      };

      const chatRoomId =
        await this.chattingRepository.getIdByQuestionAndTeacher(
          tutoring.questionId,
          teacherId,
        );

      if (tutoring.status == 'reserved') {
        await this.socketService.sendMessageToBothUser(
          tutoring.teacherId,
          tutoring.studentId,
          chatRoomId,
          'text',
          JSON.stringify(startMessage),
        );
      }

      const roomInfo = await this.classroomChannel(tutoring.id, teacherId);

      const whiteBoardInfo: WhiteBoardChannelInfo = {
        whiteBoardAppId: roomInfo.boardAppId,
        whiteBoardUUID: roomInfo.boardUUID,
      };

      this.agoraService
        .startRecord(whiteBoardInfo, roomInfo.rtcChannel, tutoringId)
        .then((result) => {
          console.log(result, 'result', tutoringId, 'tutoringId');
          this.tutoringRepository.setRecordingInfo(
            result.tutoringId,
            result.resourceId,
            result.sid,
          );
        })
        .catch((e) => console.log(e));

      return new Success('과외가 시작되었습니다.', roomInfo);
    } catch (error) {
      return new Fail('과외 시작에 실패했습니다.');
    }
  }

  async createReview(
    userId: string,
    tutoringId: string,
    createReviewDto: CreateReviewDto,
  ) {
    try {
      return this.tutoringRepository.createReview(
        userId,
        tutoringId,
        createReviewDto,
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async tutoringList(userId: any) {
    try {
      const user = await this.userRepository.get(userId);
      const role = user.role;

      const tutoringHistory = await this.tutoringRepository.history(
        userId,
        role,
      );
      const result = await Promise.all(
        tutoringHistory.map(async (tutoring) => {
          const question = await this.questionRepository.getInfo(
            tutoring.questionId,
          );
          const opponent = await this.userRepository.get(
            role == 'teacher' ? tutoring.studentId : tutoring.teacherId,
          );
          const history: TutoringHistory = {
            tutoringId: tutoring.id,
            description: question.problem.description,
            schoolLevel: question.problem.schoolLevel,
            schoolSubject: question.problem.schoolSubject,
            tutoringDate: tutoring.startedAt,
            questionId: tutoring.questionId,
            opponentName: opponent.name,
            opponentProfileImage: opponent.profileImage,
            questionImage: question.problem.mainImage,
            recordFileUrl: tutoring.recordingFilePath,
          };
          return history;
        }),
      );

      return new Success('과외 내역을 가져왔습니다.', result);
    } catch (error) {
      console.log(error);
      return new Fail('과외 내역을 가져오는데 실패했습니다.');
    }
  }

  async reviewList(userId: any) {
    const user = await this.userRepository.get(userId);
    if (user.role === 'student') {
      return new Fail('선생님의 리뷰 내역만 볼 수 있습니다.');
    }

    try {
      const reviewHistory = await this.tutoringRepository.reviewHistory(userId);

      for (const review of reviewHistory) {
        review.student = await this.userRepository.getOther(review.studentId);
      }

      return new Success('리뷰 내역을 가져왔습니다.', {
        count: reviewHistory.length,
        history: reviewHistory,
      });
    } catch (error) {
      return new Fail('리뷰 내역을 가져오는데 실패했습니다.');
    }
  }

  /**
   * 특정 사용자의 정보를 가져옵니다.
   * @param userId 조회할 사용자 ID
   * @returns User 사용자 정보, 민감한 정보는 포함되지 않습니다.
   */
  async getOther(userId: string): Promise<UserListing> {
    const user: User = await this.userRepository.get(userId);
    if (user === undefined) {
      return undefined;
    } else {
      if (user.role == 'teacher') {
        const accTutoring =
          await this.tutoringRepository.getTutoringCntOfTeacher(userId);
        const teacher: TeacherListing = {
          id: user.id,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          univ: user.school.name,
          major: user.school.department,
          followerIds: user.followers,
          reserveCnt: accTutoring.length,
          bio: user.bio,
          rating: 5,
        };
        console.log(teacher);
        return teacher;
      } else if (user.role == 'student') {
        const student: StudentListing = {
          id: user.id,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          schoolLevel: user.school.level,
          grade: user.school.grade,
        };
        return student;
      }
    }
  }
}
