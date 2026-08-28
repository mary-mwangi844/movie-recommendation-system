import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';

export enum RecommendationType {
  PERSONALIZED = 'PERSONALIZED',
  TRENDING = 'TRENDING',
  SIMILAR = 'SIMILAR',
  EDITOR_PICK = 'EDITOR_PICK',
}

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async generatePersonalized(userId: string) {
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    const userRatings = await this.prisma.rating.findMany({
      where: { userId },
      include: { movie: { include: { genres: true } } },
    });

    const preferredGenres = preferences?.preferredGenres || [];
    const preferredActors = preferences?.preferredActors || [];
    const minRating = preferences?.minRating || 3.0;

    const highlyRatedGenres = userRatings
      .filter((r) => r.rating >= 4)
      .flatMap((r) => r.movie.genres.map((g) => g.name));

    const watchedMovieIds = userRatings.map((r) => r.movieId);

    const allMovies = await this.prisma.movie.findMany({
      where: {
        isActive: true,
        id: { notIn: watchedMovieIds },
        averageRating: { gte: minRating },
      },
      include: { genres: true },
    });

    const scoredMovies = allMovies.map((movie) => {
      let score = 0;
      let reasons: string[] = [];

      const movieGenreNames = movie.genres.map((g) => g.name);

      const genreMatches = movieGenreNames.filter((g) =>
        preferredGenres.includes(g),
      ).length;
      if (genreMatches > 0) {
        score += genreMatches * 0.3;
        reasons.push(`Matches ${genreMatches} of your preferred genres`);
      }

      const highlyRatedMatches = movieGenreNames.filter((g) =>
        highlyRatedGenres.includes(g),
      ).length;
      if (highlyRatedMatches > 0) {
        score += highlyRatedMatches * 0.4;
        reasons.push(
          `Similar to movies you rated highly (${highlyRatedMatches} genres)`,
        );
      }

      score += movie.averageRating * 0.2;
      score += movie.popularity * 0.1;

      return {
        movie,
        score: Math.min(score, 1),
        reason: reasons.join('. ') || 'Based on your viewing patterns',
      };
    });

    const topRecommendations = scoredMovies
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    await this.prisma.recommendation.deleteMany({
      where: {
        userId,
        recommendationType: RecommendationType.PERSONALIZED,
      },
    });

    for (const rec of topRecommendations) {
      await this.prisma.recommendation.create({
        data: {
          userId,
          movieId: rec.movie.id,
          score: rec.score,
          reason: rec.reason,
          recommendationType: RecommendationType.PERSONALIZED,
        },
      });
    }

    return topRecommendations;
  }

  async getTrending() {
    const movies = await this.prisma.movie.findMany({
      where: { isActive: true },
      orderBy: { popularity: 'desc' },
      take: 20,
      include: { genres: true },
    });

    return movies.map((movie) => ({
      movie,
      score: movie.popularity / 100,
      reason: 'Trending among all users',
      recommendationType: RecommendationType.TRENDING,
    }));
  }

  async getSimilar(movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: { genres: true },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    const genreIds = movie.genres.map((g) => g.id);

    const similarMovies = await this.prisma.movie.findMany({
      where: {
        id: { not: movieId },
        isActive: true,
        genres: {
          some: {
            id: { in: genreIds },
          },
        },
      },
      take: 20,
      include: { genres: true },
    });

    return similarMovies.map((m) => {
      const sharedGenres = m.genres.filter((g) =>
        genreIds.includes(g.id),
      ).length;
      const score = sharedGenres / Math.max(genreIds.length, 1);

      return {
        movie: m,
        score,
        reason: `Shares ${sharedGenres} genre(s) with ${movie.title}`,
        recommendationType: RecommendationType.SIMILAR,
      };
    });
  }

  async getUserRecommendations(userId: string) {
    const recommendations = await this.prisma.recommendation.findMany({
      where: { userId },
      include: {
        movie: {
          include: { genres: true },
        },
      },
      orderBy: { score: 'desc' },
    });

    if (recommendations.length === 0) {
      await this.generatePersonalized(userId);
      return this.getUserRecommendations(userId);
    }

    return recommendations;
  }

  async refreshRecommendations(userId: string) {
    await this.generatePersonalized(userId);
    return this.getUserRecommendations(userId);
  }
}
