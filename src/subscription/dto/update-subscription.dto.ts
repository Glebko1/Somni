import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsIn(['free', 'plus', 'premium', 'enterprise'])
  plan!: 'free' | 'plus' | 'premium' | 'enterprise';

  @IsInt()
  @Min(1)
  months!: number;

  @IsOptional()
  @IsBoolean()
  includeTrial?: boolean;
}
