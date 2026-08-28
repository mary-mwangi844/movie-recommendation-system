import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { AddHistoryDto } from './dto/add-history.dto';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async add(movieId: string, userId: string, dto: AddHistoryDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.prisma.movie.update({
      where: { id: movieId },
      data: { views: { increment: 1 } },
    });

    return this.prisma.viewHistory.create({
      data: {
        userId,
        movieId,
        watchDuration: dto.watchDuration,
        completed: dto.completed ?? false,
      },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            averageRating: true,
          },
        },
      },
    });
  }

  async getHistory(userId: string) {
    return this.prisma.viewHistory.findMany({
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
      orderBy: { watchedAt: 'desc' },
    });
  }

  async delete(historyId: string, userId: string) {
    const history = await this.prisma.viewHistory.findUnique({
      where: { id: historyId },
    });

    if (!history) {
      throw new NotFoundException('History entry not found');
    }

    if (history.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.viewHistory.delete({
      where: { id: historyId },
    });

    return { message: 'History entry deleted' };
  }
}
