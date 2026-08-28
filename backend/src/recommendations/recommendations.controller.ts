import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserRecommendations(@CurrentUser('id') userId: string) {
    return this.recommendationsService.getUserRecommendations(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshRecommendations(@CurrentUser('id') userId: string) {
    return this.recommendationsService.refreshRecommendations(userId);
  }

  @Public()
  @Get('trending')
  async getTrending() {
    return this.recommendationsService.getTrending();
  }

  @Public()
  @Get('similar/:movieId')
  async getSimilar(@Param('movieId') movieId: string) {
    return this.recommendationsService.getSimilar(movieId);
  }
}
