import { FcmService } from './fcm.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FcmService', () => {
  let service: FcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcmService],
    }).compile();

    service = module.get<FcmService>(FcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
