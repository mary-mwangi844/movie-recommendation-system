import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SearchMoviesDto } from './dto/search-movies.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Public()
  @Get()
  async findAll(@Query() dto: SearchMoviesDto) {
    return this.moviesService.findAll(dto);
  }

  @Public()
  @Get('trending')
  async getTrending(@Query('limit') limit?: string) {
    return this.moviesService.getTrending(limit ? parseInt(limit) : 10);
  }

  @Public()
  @Get('search')
  async search(@Query() dto: SearchMoviesDto) {
    return this.moviesService.findAll(dto);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Public()
  @Get(':id/similar')
  async getSimilar(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.moviesService.getSimilar(id, limit ? parseInt(limit) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateMovieDto, @CurrentUser('role') role: string) {
    return this.moviesService.create(dto, role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMovieDto, @CurrentUser('role') role: string) {
    return this.moviesService.update(id, dto, role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('role') role: string) {
    return this.moviesService.remove(id, role);
  }
}
