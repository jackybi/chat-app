import { Test, TestingModule } from '@nestjs/testing';
import { TranslateMessageService } from './translate-message.service';

describe('TranslateMessageService', () => {
  let service: TranslateMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslateMessageService],
    }).compile();

    service = module.get<TranslateMessageService>(TranslateMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
