import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { SearchMoviesDto } from './dto/search-movies.dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: SearchMoviesDto) {
    const { query, genre, year, minRating, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (genre) {
      where.genres = {
        some: {
          name: { equals: genre, mode: 'insensitive' } },
      };
    }

    if (year) {
      where.releaseYear = year;
    }

    if (minRating !== undefined) {
      where.averageRating = { gte: minRating };
    }

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: {
          genres: true,
        },
        skip,
        take: limit,
        orderBy: { popularity: 'desc' },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      movies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        genres: true,
      },
    });

    if (!movie || !movie.isActive) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async create(dto: CreateMovieDto, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create movies');
    }

    const { genreIds, ...movieData } = dto;

    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        genres: genreIds ? {
          connect: genreIds.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        genres: true,
      },
    });

    return movie;
  }

  async update(id: string, dto: UpdateMovieDto, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update movies');
    }

    const movie = await this.prisma.movie.update({
      where: { id },
      data: dto,
      include: {
        genres: true,
      },
    });

    return movie;
  }

  async remove(id: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete movies');
    }

    await this.prisma.movie.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Movie deleted successfully' };
  }

  async getTrending(limit = 10) {
    return this.prisma.movie.findMany({
      where: { isActive: true },
      orderBy: { popularity: 'desc' },
      take: limit,
      include: {
        genres: true,
      },
    });
  }

  async getSimilar(id: string, limit = 10) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { genres: true },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const genreIds = movie.genres.map((g) => g.id);

    return this.prisma.movie.findMany({
      where: {
        id: { not: id },
        isActive: true,
        genres: {
          some: {
            id: { in: genreIds },
          },
        },
      },
      take: limit,
      include: {
        genres: true,
      },
      orderBy: { averageRating: 'desc' },
    });
  }
}
