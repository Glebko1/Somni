import { IsBoolean, IsIn } from 'class-validator';

export class TrackPaywallDto {
  @IsIn(['control', 'social-proof'])
  variant!: 'control' | 'social-proof';

  @IsBoolean()
  converted!: boolean;
}
