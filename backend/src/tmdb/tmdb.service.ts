import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class TmdbService {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.baseUrl =
      this.configService.get<string>('TMDB_BASE_URL') ||
      'https://api.themoviedb.org/3';

    this.token =
      this.configService.get<string>('TMDB_READ_ACCESS_TOKEN') || '';

    if (!this.token) {
      throw new Error('TMDB_READ_ACCESS_TOKEN is not configured');
    }
  }

  private async request(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`TMDB request failed: ${response.status} ${error}`);
    }

    return response.json();
  }

  async importPopularMovies(page = 1) {
    try {
      const data = await this.request(
        `/movie/popular?language=en-US&page=${page}`,
      );

      let imported = 0;
      let skipped = 0;

      for (const tmdbMovie of data.results) {
        if (!tmdbMovie.id || !tmdbMovie.title) {
          skipped++;
          continue;
        }

        const releaseYear = tmdbMovie.release_date
          ? parseInt(tmdbMovie.release_date.substring(0, 4), 10)
          : null;

        if (!releaseYear) {
          skipped++;
          continue;
        }

        const genreIds: string[] = [];

        for (const tmdbGenreId of tmdbMovie.genre_ids || []) {
          const genreName = this.getGenreName(tmdbGenreId);

          if (!genreName) {
            continue;
          }

          const genre = await this.prisma.genre.upsert({
            where: {
              name: genreName,
            },
            update: {},
            create: {
              name: genreName,
              description: `${genreName} genre`,
            },
          });

          genreIds.push(genre.id);
        }

        const movieData = {
          title: tmdbMovie.title,
          description: tmdbMovie.overview || 'No description available.',
          releaseYear,
          posterUrl: tmdbMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
            : null,
          backdropUrl: tmdbMovie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}`
            : null,
          tmdbId: tmdbMovie.id,
          averageRating: tmdbMovie.vote_average || 0,
          popularity: tmdbMovie.popularity || 0,
          isActive: true,
        };

        const existingMovie = await this.prisma.movie.findUnique({
          where: {
            tmdbId: tmdbMovie.id,
          },
        });

        if (existingMovie) {
          await this.prisma.movie.update({
            where: {
              id: existingMovie.id,
            },
            data: {
              ...movieData,
              genres: {
                set: genreIds.map((id) => ({ id })),
              },
            },
          });

          skipped++;
        } else {
          await this.prisma.movie.create({
            data: {
              ...movieData,
              genres: {
                connect: genreIds.map((id) => ({ id })),
              },
            },
          });

          imported++;
        }
      }

      return {
        message: 'TMDB movies imported successfully',
        page,
        imported,
        skipped,
        totalFromTmdb: data.results.length,
      };
    } catch (error) {
      console.error('TMDB import failed:', error);

      throw new InternalServerErrorException(
        'Failed to import movies from TMDB',
      );
    }
  }

  private getGenreName(tmdbGenreId: number): string | null {
    const genres: Record<number, string> = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      27: 'Horror',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Sci-Fi',
      53: 'Thriller',
      37: 'Western',
      36: 'History',
      10752: 'War',
      10402: 'Music',
      10770: 'TV Movie',
    };

    return genres[tmdbGenreId] || null;
  }
}
