import { PartialType } from '@nestjs/mapped-types';
import { CreateTranslateMessageDto } from './create.dto';

export class UpdateTranslateMessageDto extends PartialType(
  CreateTranslateMessageDto,
) {}
