import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { compare, hash } from 'bcrypt';
import { AppError } from 'src/common/constans/errors';
import { AuthUserResponse, UserResponse } from '../auth/response';
import { TokenService } from '../token/token.service';
import { Watchlist } from '../watchlist/models/watchlist.model';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from './dto';
import { User } from './models/user.models';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return hash(password, 10);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const existUser = await this.findUserByEmail(dto.email);
    if (existUser) throw new BadRequestException(AppError.USER_EXIST);
    try {
      dto.password = await this.hashPassword(dto.password);
      await this.userRepository.create({
        firstName: dto.firstName,
        username: dto.username,
        email: dto.email,
        password: dto.password,
      });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async publicUser(email: string): Promise<AuthUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        attributes: { exclude: ['password'] },
        include: {
          model: Watchlist,
          required: false,
        },
      });
      const { id, firstName, username } = user;
      const userData = { id, firstName, username, email };
      const token = await this.tokenService.generateJwtToken(userData);

      return { user, token };
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePassword(userId: number, dto: UpdatePasswordDTO): Promise<any> {
    try {
      const { password } = await this.findUserById(userId);
      const currentPassword = await compare(dto.oldPassword, password);
      if (!currentPassword) return new BadRequestException(AppError.WRONG_DATA);
      const newPassword = await this.hashPassword(dto.newPassword);
      const data = {
        password: newPassword,
      };
      return this.userRepository.update(data, { where: { id: userId } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(userId: number, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepository.update(dto, { where: { id: userId } });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { id } });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
