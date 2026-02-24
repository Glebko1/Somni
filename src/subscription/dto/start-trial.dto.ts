import { IsInt, Max, Min } from 'class-validator';

export class StartTrialDto {
  @IsInt()
  @Min(3)
  @Max(30)
  days!: number;
}
