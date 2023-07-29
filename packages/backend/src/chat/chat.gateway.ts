import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { RCode } from 'src/config/rcode';
import { defaultGroupId } from 'src/config/global';
import { UseGuards } from '@nestjs/common';
import { ChatWsGuard } from './chatws.guard';
import { TranslateMessageService } from 'src/translate-message/translate-message.service';
import { Translator } from './translator';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly translateService: TranslateMessageService,
  ) {}

  async handleConnection(client: Socket): Promise<string> {
    console.log('Connection:', client.handshake.query);
    const token = client.handshake.query.token as string;
    const user = await this.authService.verifyUserToken(token);
    const { id } = user;

    client.join(defaultGroupId);

    console.log('user logon', id);

    client.broadcast.emit('userOnline', {
      code: RCode.OK,
      msg: 'userOnline',
      data: id,
    });

    if (id) {
      client.join(`${id}`);
    }
    return '连接成功';
  }

  async handleDisconnect(client: Socket): Promise<any> {
    const userId = client.handshake.query.userId;
    console.log('user offline', userId);

    client.broadcast.emit('userOffline', {
      code: RCode.OK,
      msg: 'userOffline',
      data: userId,
    });
  }

  @UseGuards(ChatWsGuard)
  @SubscribeMessage('groupTranslateEnMessage')
  async handleGroupAllMessage(
    @ConnectedSocket() client: Socket & { user: User },
    @MessageBody() data: GroupAllMessageDto,
  ): Promise<any> {
    const user = client.user;
    const messageId = await this.translateService.saveMessage({
      userId: user.id,
      content: data.content,
      messageType: 'text',
      tContent: '',
    });

    this.server.to(defaultGroupId).emit('groupTranslateMessage', {
      code: RCode.OK,
      msg: null,
      data: {
        ...data,
        userId: user.id,
        username: user.username,
        id: messageId,
        createTime: new Date().getTime(),
      },
    });

    const translator = new Translator(data.content);
    await translator.translate(async (isFinished, result) => {
      if (isFinished) {
        await this.translateService.updateMessage(messageId, {
          tContent: result,
        });
      }
      this.server.to(defaultGroupId).emit('groupTranslateMessage', {
        code: RCode.OK,
        msg: null,
        data: { tContent: result, id: messageId },
      });
    });
  }
}
