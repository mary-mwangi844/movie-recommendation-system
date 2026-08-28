import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(movieId: string, userId: string, dto: CreateRatingDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this movie');
    }

    const rating = await this.prisma.rating.create({
      data: {
        userId,
        movieId,
        rating: dto.rating,
        review: dto.review,
      },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            averageRating: true,
            totalRatings: true,
          },
        },
      },
    });

    await this.updateMovieRating(movieId);

    return rating;
  }

  async update(movieId: string, userId: string, dto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException();
    }

    const updatedRating = await this.prisma.rating.update({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      data: dto,
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            averageRating: true,
            totalRatings: true,
          },
        },
      },
    });

    await this.updateMovieRating(movieId);

    return updatedRating;
  }

  async remove(movieId: string, userId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.rating.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    await this.updateMovieRating(movieId);

    return { message: 'Rating deleted successfully' };
  }

  async getMovieRatings(movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return this.prisma.rating.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async updateMovieRating(movieId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { movieId },
      select: { rating: true },
    });

    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
      },
    });
  }
}
