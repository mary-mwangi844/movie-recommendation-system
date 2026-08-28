import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum WatchStatus {
  PLANNED = 'PLANNED',
  WATCHING = 'WATCHING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
}

export class AddWatchlistDto {
  @IsOptional()
  @IsEnum(WatchStatus)
  status?: WatchStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
