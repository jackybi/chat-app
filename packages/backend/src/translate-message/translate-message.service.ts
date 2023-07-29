import { Injectable } from '@nestjs/common';
import { TranslateMessage } from './entities/translate-message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTranslateMessageDto } from './dto/create.dto';
import { UpdateTranslateMessageDto } from './dto/update.dto';

@Injectable()
export class TranslateMessageService {
  constructor(
    @InjectRepository(TranslateMessage)
    private readonly messageRepository: Repository<TranslateMessage>,
  ) {}

  async saveMessage(message: CreateTranslateMessageDto) {
    const msg = await this.messageRepository.create({
      ...message,
      user: { id: message.userId },
    });
    await this.messageRepository.save(msg);
    return msg.id;
  }

  async getLatestMessages(count: number) {
    const messages = await this.messageRepository.find({
      order: { createTime: 'ASC' },
      take: count,
    });
    return messages.map((message) => ({
      ...message,
      username: message.user.username,
    }));
  }

  async updateMessage(id: number, message: UpdateTranslateMessageDto) {
    await this.messageRepository.update(id, message);
  }
}
