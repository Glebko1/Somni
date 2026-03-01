import { IsIn, IsString, MinLength } from 'class-validator';

export class StripeWebhookDto {
  @IsString()
  @MinLength(8)
  eventId!: string;

  @IsIn(['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'])
  type!: 'customer.subscription.created' | 'customer.subscription.updated' | 'customer.subscription.deleted';

  @IsString()
  userId!: string;

  @IsString()
  stripeSubscriptionId!: string;

  @IsString()
  stripeCustomerId!: string;

  @IsIn(['free', 'plus', 'premium', 'enterprise'])
  plan!: 'free' | 'plus' | 'premium' | 'enterprise';
}
