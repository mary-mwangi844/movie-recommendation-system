import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class AddHistoryDto {
  @IsOptional()
  @IsNumber()
  watchDuration?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
