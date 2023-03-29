import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/models/user.models';

export class UserResponse {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;
}

export class AuthUserResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  @IsString()
  token: string;
}
