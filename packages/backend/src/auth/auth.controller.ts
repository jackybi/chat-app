import {
  Body,
  Controller,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async csignIn(@Body() signInDto: Record<string, any>) {
    const tokenRes = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    return {
      data: {
        token: tokenRes.access_token,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findByName(req.user.username);
    return {
      data: {
        username: user.username,
      },
    };
  }
}
