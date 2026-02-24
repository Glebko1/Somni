import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  me(@Req() req: { user: { sub: string } }) {
    return this.userService.getProfile(req.user.sub);
  }

  @Patch('me')
  update(@Req() req: { user: { sub: string } }, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.sub, dto);
  }
}
