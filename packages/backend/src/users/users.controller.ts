import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    if (await this.usersService.findByName(createUserDto.username)) {
      return { code: '401', msg: 'duplicate username' };
    }
    await this.usersService.create(createUserDto);
    return { msg: 'success' };
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //     return this.usersService.update(+id, updateUserDto);
  //   }
}
