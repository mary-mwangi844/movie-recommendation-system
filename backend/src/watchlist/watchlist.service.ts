import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { AddWatchlistDto, WatchStatus } from './dto/add-watchlist.dto';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async add(movieId: string, userId: string, dto: AddWatchlistDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const existing = await this.prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Movie already in watchlist');
    }

    return this.prisma.watchlist.create({
      data: {
        userId,
        movieId,
        status: dto.status || WatchStatus.PLANNED,
        notes: dto.notes,
      },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            averageRating: true,
            releaseYear: true,
          },
        },
      },
    });
  }

  async update(movieId: string, userId: string, dto: AddWatchlistDto) {
    const watchlist = await this.prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!watchlist) {
      throw new NotFoundException('Movie not in watchlist');
    }

    if (watchlist.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.watchlist.update({
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
            posterUrl: true,
            averageRating: true,
            releaseYear: true,
          },
        },
      },
    });
  }

  async remove(movieId: string, userId: string) {
    const watchlist = await this.prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    if (!watchlist) {
      throw new NotFoundException('Movie not in watchlist');
    }

    if (watchlist.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.watchlist.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    return { message: 'Removed from watchlist' };
  }

  async getWatchlist(userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            averageRating: true,
            releaseYear: true,
            genres: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
