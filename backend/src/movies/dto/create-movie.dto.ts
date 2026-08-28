import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1888)
  @Max(2100)
  releaseYear: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  runtime?: number;

  @IsOptional()
  @IsString()
  posterUrl?: string;

  @IsOptional()
  @IsString()
  backdropUrl?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsNumber()
  tmdbId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genreIds?: string[];
}
