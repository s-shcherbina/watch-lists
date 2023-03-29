import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDTO } from './dto';
import { AuthUserResponse } from './response';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../users/dto';
import { AppError } from 'src/common/constans/errors';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(dto: CreateUserDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (existUser) throw new BadRequestException(AppError.USER_EXIST);
      await this.userService.createUser(dto);
      return this.userService.publicUser(dto.email);
    } catch (e) {
      throw new BadRequestException(AppError.USER_EXIST);
    }
  }

  async login(dto: UserLoginDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
      const validatePassword = await bcrypt.compare(
        dto.password,
        existUser.password,
      );
      if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);
      return this.userService.publicUser(dto.email);
    } catch (e) {
      // throw new Error(e);
    }
  }
}
