import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class TrackUsageDto {
  @IsString()
  feature!: string;

  @IsString()
  action!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  units?: number;
}
