import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

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
