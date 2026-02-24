import { IsInt, IsString, Min } from 'class-validator';

export class RewardActionDto {
  @IsString()
  source!: string;

  @IsInt()
  @Min(1)
  value!: number;
}
