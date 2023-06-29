import { Module } from '@nestjs/common';
import { TranslateMessageController } from './translate-message.controller';
import { TranslateMessageService } from './translate-message.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslateMessage } from './entities/translate-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TranslateMessage]),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TranslateMessageController],
  providers: [TranslateMessageService],
  exports: [TranslateMessageService],
})
export class TranslateMessageModule {}
