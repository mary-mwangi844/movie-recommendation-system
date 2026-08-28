import { Controller, Post, Delete, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddWatchlistDto } from './dto/add-watchlist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Post(':movieId')
  async add(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddWatchlistDto,
  ) {
    return this.watchlistService.add(movieId, userId, dto);
  }

  @Patch(':movieId')
  async update(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddWatchlistDto,
  ) {
    return this.watchlistService.update(movieId, userId, dto);
  }

  @Delete(':movieId')
  async remove(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.watchlistService.remove(movieId, userId);
  }

  @Get()
  async getWatchlist(@CurrentUser('id') userId: string) {
    return this.watchlistService.getWatchlist(userId);
  }
}
