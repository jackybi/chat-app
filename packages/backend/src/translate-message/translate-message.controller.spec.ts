import { Test, TestingModule } from '@nestjs/testing';
import { TranslateMessageController } from './translate-message.controller';

describe('TranslateMessageController', () => {
  let controller: TranslateMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslateMessageController],
    }).compile();

    controller = module.get<TranslateMessageController>(
      TranslateMessageController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
