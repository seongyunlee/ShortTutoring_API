import { RedisRepository } from '../redis/redis.repository';
import { Fail, Success } from '../response';
import { TutoringRepository } from '../tutoring/tutoring.repository';
import { TeacherListing } from '../user/entities/user.entities';
import { UserRepository } from '../user/user.repository';
import { Controller } from '@nestjs/common';

@Controller('service')
export class OnlineService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly userRepository: UserRepository,
    private readonly tutoringRepository: TutoringRepository,
  ) {}

  async getOnlineTeachers(userId: string) {
    try {
      const users = await this.redisRepository.getAllKeys();
      const userState = await Promise.all(
        users.map(async (user) => {
          return {
            id: user,
            online: (await this.redisRepository.getSocketId(user)) != null,
          };
        }),
      );
      const onlineUsers = userState.filter((user) => user.online);
      if (onlineUsers.length == 0)
        return new Success('현재 온라인 선생님이 없습니다.', []);
      const userIds = onlineUsers.map((teacher) => teacher.id);
      const userInfos = await this.userRepository.usersInfo(userIds);
      const teacherInfos = userInfos.filter((user) => user.role == 'teacher');
      //TODO: rating 수정
      const result: TeacherListing[] = await Promise.all(
        teacherInfos.map(async (teacher) => {
          return {
            id: teacher.id,
            name: teacher.name,
            profileImage: teacher.profileImage,
            role: teacher.role,
            univ: teacher.school.name,
            major: teacher.school.department,
            followerIds: teacher.followers,
            reserveCnt: (
              await this.tutoringRepository.getTutoringCntOfTeacher(teacher.id)
            ).length,
            bio: teacher.bio,
            rating: 5,
          };
        }),
      );
      return new Success(
        '현재 온라인 선생님들을 성공적으로 가져왔습니다.',
        result,
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }
}
