import { IsIn, IsInt, Min } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsIn(['free', 'plus', 'premium'])
  plan!: 'free' | 'plus' | 'premium';

  @IsInt()
  @Min(1)
  months!: number;
}
