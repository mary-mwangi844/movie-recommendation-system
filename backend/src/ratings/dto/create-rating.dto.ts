import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  review?: string;
}
