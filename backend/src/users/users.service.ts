import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
      },
    });
  }

  async getPreferences(userId: string) {
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return this.prisma.userPreference.create({
        data: { userId },
      });
    }

    return preferences;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }

  async getUserRatings(userId: string, requestUserId: string) {
    if (userId !== requestUserId) {
      throw new ForbiddenException();
    }

    return this.prisma.rating.findMany({
      where: { userId },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserWatchlist(userId: string, requestUserId: string) {
    if (userId !== requestUserId) {
      throw new ForbiddenException();
    }

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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserRecommendations(userId: string, requestUserId: string) {
    if (userId !== requestUserId) {
      throw new ForbiddenException();
    }

    return this.prisma.recommendation.findMany({
      where: { userId },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            averageRating: true,
            genres: true,
          },
        },
      },
      orderBy: { score: 'desc' },
    });
  }

  async getViewHistory(userId: string, requestUserId: string) {
    if (userId !== requestUserId) {
      throw new ForbiddenException();
    }

    return this.prisma.viewHistory.findMany({
      where: { userId },
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
      orderBy: { watchedAt: 'desc' },
    });
  }
}
