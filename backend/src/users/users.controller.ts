import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) { }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getMe(req.user.userId);
  }

  @Patch('me')
  updateMe(
    @Req() req,
    @Body() body: UpdateMeDto,
  ) {
    return this.usersService.updateMe(
      req.user.userId,
      body,
    );
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(
      id,
      body.role,
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    body: UpdateStatusDto,
  ) {
    return this.usersService.updateStatus(
      id,
      body.status,
    );
  }

  @Patch('change-password')
  changePassword(
    @Req() req,
    @Body() body: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      body,
    );
  }

  @Patch('deactivate')
  deactivateAccount(
    @Req() req,
  ) {
    return this.usersService
      .deactivateAccount(
        req.user.userId,
      );
  }
}