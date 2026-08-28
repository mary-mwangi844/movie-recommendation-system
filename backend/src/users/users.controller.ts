import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('preferences')
  async getPreferences(@CurrentUser('id') userId: string) {
    return this.usersService.getPreferences(userId);
  }

  @Patch('preferences')
  async updatePreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(userId, dto);
  }

  @Get('ratings')
  async getUserRatings(@CurrentUser('id') userId: string) {
    return this.usersService.getUserRatings(userId, userId);
  }

  @Get('watchlist')
  async getUserWatchlist(@CurrentUser('id') userId: string) {
    return this.usersService.getUserWatchlist(userId, userId);
  }

  @Get('recommendations')
  async getUserRecommendations(@CurrentUser('id') userId: string) {
    return this.usersService.getUserRecommendations(userId, userId);
  }

  @Get('history')
  async getViewHistory(@CurrentUser('id') userId: string) {
    return this.usersService.getViewHistory(userId, userId);
  }
}
