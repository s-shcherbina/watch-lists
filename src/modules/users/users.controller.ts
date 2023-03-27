import {
  Body,
  Controller,
  Delete,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { UpdatePasswordDTO, UpdateUserDTO } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiTags('API')
  @ApiResponse({ status: 200, type: UpdateUserDTO })
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(
    @Body() updateDto: UpdateUserDTO,
    @Req() request, //: Request,
  ): Promise<UpdateUserDTO> {
    const user = request.user;
    console.log(user);
    return this.userService.updateUser(user.id, updateDto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDTO,
    @Req() request,
  ): Promise<any> {
    const user = request.user;
    return this.userService.updatePassword(user.id, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() request): Promise<boolean> {
    const user = request.user;
    return this.userService.deleteUser(user.id);
  }
}
