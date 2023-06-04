import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatWsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let client: Socket;
    try {
      client = context.switchToWs().getClient<Socket>();
      const authToken: string = client.handshake?.query?.token as string;
      const payload = await this.jwtService.verifyAsync(authToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersService.findByName(payload.username);
      client['user'] = user;
      return Boolean(user);
    } catch (err) {
      client.emit('unauthorized', '用户信息校验失败,请重新登录!');
      client.disconnect();
      throw new WsException(err.message);
    }
  }
}
