import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TranslateMessageService } from './translate-message.service';

@Controller('translate-message')
@UseGuards(AuthGuard)
export class TranslateMessageController {
  constructor(private readonly translateService: TranslateMessageService) {}

  @Get('/latest')
  async getLatestMessages() {
    const messages = await this.translateService.getLatestMessages(100);
    return { data: messages };
  }
}
