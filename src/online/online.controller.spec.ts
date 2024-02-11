import { Test, TestingModule } from '@nestjs/testing';
import { OnlineController } from './online.controller';

describe('OnlineController', () => {
  let controller: OnlineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineController],
    }).compile();

    controller = module.get<OnlineController>(OnlineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
