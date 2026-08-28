import { IsArray, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredGenres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredActors?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsString()
  language?: string;
}
