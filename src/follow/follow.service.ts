import { Fail, Success } from '../response';
import { User } from '../user/entities/user.interface';
import { UserRepository } from '../user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowService {
  constructor(private readonly userRepository: UserRepository) {}

  async follow(studentId: string, teacherId: string) {
    try {
      await this.userRepository.follow(studentId, teacherId);
      return new Success('성공적으로 팔로우했습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async unfollow(studentId: string, teacherId: string) {
    try {
      await this.userRepository.unfollow(studentId, teacherId);
      return new Success('성공적으로 언팔로우했습니다.');
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /**
   * 내가 팔로우한 선생님들을 가져옵니다.
   */
  async following(studentId: string) {
    try {
      return new Success(
        '성공적으로 팔로잉한 선생님들을 가져왔습니다.',
        await this.userRepository.following(studentId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async otherFollowers(userId: string) {
    try {
      const user = await this.userRepository.get(userId);
      const userList = await Promise.all(
        user.followers.map(
          async (id) => await this.userRepository.getOther(id),
        ),
      );
      return new Success(
        '해당 사용자를 팔로우하는 사용자들의 정보를 성공적으로 가져왔습니다.',
        userList,
      );
    } catch (error) {
      return new Fail(
        '해당 사용자를 팔로우하는 사용자들의 정보를 가져오는데 실패했습니다.',
      );
    }
  }

  async followers(teacherId: string) {
    try {
      const teacher: User = await this.userRepository.get(teacherId);
      const followers = [];
      for (const followerId of teacher.followers) {
        followers.push(await this.userRepository.getOther(followerId));
      }
      return new Success(
        '성공적으로 팔로워 학생들을 가져왔습니다.',
        await this.userRepository.followers(teacherId),
      );
    } catch (error) {
      return new Fail(error.message);
    }
  }

  async otherFollowing(userId: string) {
    try {
      const user = await this.userRepository.get(userId);
      const userList = await Promise.all(
        user.following.map(
          async (id) => await this.userRepository.getOther(id),
        ),
      );
      return new Success(
        '해당 사용자가 팔로잉하는 사용자들의 정보를 성공적으로 가져왔습니다.',
        userList,
      );
    } catch (error) {
      return new Fail(
        '해당 사용자가 팔로잉하는 사용자들의 정보를 가져오는데 실패했습니다.',
      );
    }
  }
}
