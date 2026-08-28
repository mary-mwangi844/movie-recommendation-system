import { Controller, Post, Patch, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('movies/:movieId/ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.create(movieId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(movieId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @Param('movieId') movieId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.ratingsService.remove(movieId, userId);
  }

  @Public()
  @Get()
  async getMovieRatings(@Param('movieId') movieId: string) {
    return this.ratingsService.getMovieRatings(movieId);
  }
}
