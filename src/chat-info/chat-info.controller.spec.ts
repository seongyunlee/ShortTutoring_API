import { Test, TestingModule } from '@nestjs/testing';
import { ChatInfoController } from './chat-info.controller';

describe('ChatInfoController', () => {
  let controller: ChatInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatInfoController],
    }).compile();

    controller = module.get<ChatInfoController>(ChatInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
