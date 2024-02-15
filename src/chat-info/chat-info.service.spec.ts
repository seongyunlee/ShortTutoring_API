import { Test, TestingModule } from '@nestjs/testing';
import { ChatInfoService } from './chat-info.service';

describe('ChatInfoService', () => {
  let service: ChatInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatInfoService],
    }).compile();

    service = module.get<ChatInfoService>(ChatInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
