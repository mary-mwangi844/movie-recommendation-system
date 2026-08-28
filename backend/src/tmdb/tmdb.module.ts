import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';
import { PrismaService } from '../common/database/prisma.service';

@Module({
  controllers: [TmdbController],
  providers: [TmdbService, PrismaService],
  exports: [TmdbService],
})
export class TmdbModule {}

