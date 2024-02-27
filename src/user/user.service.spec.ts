import { AuthRepository } from '../auth/auth.repository';
import { Success } from '../response';
import { UploadService } from '../upload/upload.service';
import { CreateStudentDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getOther: jest.fn(),
    getTeachers: jest.fn(),
    receiveFreeCoin: jest.fn(),
  };

  const mockAuthRepository = {
    createAuth: jest.fn(),
    delete: jest.fn(),
    signJwt: jest.fn(),
  };

  const mockUploadService = {
    uploadBase64: jest.fn(),
  };

  beforeEach(() => {
    userService = new UserService(
      mockAuthRepository as unknown as AuthRepository,
      mockUserRepository as unknown as UserRepository,
      mockUploadService as unknown as UploadService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('profile', () => {
    it('should successfully get a user profile', async () => {
      const userId = 'test-user-id';

      // Mock userRepository.get to return a user
      mockUserRepository.get.mockResolvedValue({
        id: userId,
        name: 'Test User',
        bio: 'This is a test user',
        role: 'student',
        profileImage: 'test-image.png',
      });

      const result = await userService.profile(userId);

      expect(mockUserRepository.get).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.get).toHaveBeenCalledWith(userId);
      expect(result).toBeInstanceOf(Success);
      expect(result.message).toEqual('나의 프로필을 성공적으로 조회했습니다.');
      expect(result.data).toHaveProperty('id', userId);
    });

    // Add more test cases for edge cases and error scenarios
  });

  describe('signupStudent', () => {
    it('should successfully sign up a student', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'test-student',
        bio: 'lets study!',
        schoolGrade: 3,
        schoolLevel: 'high',
        vendor: 'kakao',
        profileImg: 'dog',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZW5kb3IiOiJrYWthbyIsImF1dGhJZCI6IjZkMDJmMzc1LWFlNTYtNDhkYy1hNGQxLWMyMWNlNDRiZDkxOCIsInVzZXJJZCI6IjZkMDJmMzc1LWFlNTYtNDhkYy1hNGQxLWMyMWNlNDRiZDkxOCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzA4MDUzMDI3LCJleHAiOjE3MDgxMzk0Mjd9.oB66f3LLEfWfyvcaeVciLbUtlrQ14sybT8Txb39iud8',
      };

      // Mock any dependencies if needed

      // Mock userRepository.create to return a user
      mockUserRepository.create.mockResolvedValue({
        /* mock user data */
      });

      // Mock authRepository.signJwt to return a token
      mockAuthRepository.signJwt.mockResolvedValue('mockToken');

      const result = await userService.signupStudent(createStudentDto);

      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.signJwt).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Success);
      expect(result.message).toEqual('성공적으로 회원가입했습니다.');
      expect(result.data).toHaveProperty('token', 'mockToken');
    });

    // Add more test cases for edge cases and error scenarios
  });

  // Add similar test cases for other methods like signupTeacher, login, profile, etc.
});
