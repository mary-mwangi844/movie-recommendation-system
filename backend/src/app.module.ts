import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { RatingsModule } from './ratings/ratings.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { HistoryModule } from './history/history.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { TmdbModule } from './tmdb/tmdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    RatingsModule,
    WatchlistModule,
    HistoryModule,
    RecommendationsModule,
    TmdbModule,
  ],
})
export class AppModule {}
