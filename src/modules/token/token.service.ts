import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserResponse } from '../auth/response';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateJwtToken(user: UserResponse) {
    return this.jwtService.sign(
      { user },
      {
        secret: this.configService.get('secret_jwt'),
        expiresIn: this.configService.get('expire_jwt'),
      },
    );
  }
}
