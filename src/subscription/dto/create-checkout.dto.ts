import { IsIn } from 'class-validator';

export class CreateCheckoutDto {
  @IsIn(['plus', 'premium', 'enterprise'])
  plan!: 'plus' | 'premium' | 'enterprise';
}
