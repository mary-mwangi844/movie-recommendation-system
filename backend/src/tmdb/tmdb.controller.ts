import { Controller, Get, Post, Query, Param, UseGuards } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page?: string,
  ) {
    return this.tmdbService.searchMovies(
      query,
      page ? parseInt(page, 10) : 1,
    );
  }

  @Get('trending')
  async getTrendingMovies(@Query('page') page?: string) {
    return this.tmdbService.getTrendingMovies(
      page ? parseInt(page, 10) : 1,
    );
  }

  @Get('genre/:genreId')
  async getMoviesByGenre(
    @Param('genreId') genreId: string,
    @Query('page') page?: string,
  ) {
    return this.tmdbService.getMoviesByGenre(
      parseInt(genreId, 10),
      page ? parseInt(page, 10) : 1,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  async importMovies(
    @Query('page') page: string,
    @CurrentUser('role') role: string,
  ) {
    if (role !== 'ADMIN') {
      return {
        message: 'Only admins can import movies',
      };
    }

    return this.tmdbService.importPopularMovies(
      page ? parseInt(page, 10) : 1,
    );
  }
}
