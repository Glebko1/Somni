import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddFriendDto } from './dto/add-friend.dto';
import { FriendsRankingService } from './friends-ranking.service';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsRankingController {
  constructor(private readonly friendsService: FriendsRankingService) {}

  @Post('add')
  add(@Req() req: { user: { sub: string } }, @Body() dto: AddFriendDto) {
    return this.friendsService.addFriend(req.user.sub, dto);
  }

  @Get('ranking')
  ranking(@Req() req: { user: { sub: string } }) {
    return this.friendsService.ranking(req.user.sub);
  }
}
