import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dto';
import { AuthUserResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiTags('API')
  @ApiResponse({ status: 201, type: AuthUserResponse })
  @Post('register')
  register(@Body() dto: CreateUserDTO): Promise<AuthUserResponse> {
    return this.authService.register(dto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: AuthUserResponse })
  @Post('login')
  login(
    @Body() dto: UserLoginDTO,
  ): Promise<AuthUserResponse | BadRequestException> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-public-user-info')
  getPublicUserInfo(@Req() req) {
    const user = req.user;
    return this.userService.publicUser(user.email);
  }
}
