import { IsString, MinLength } from 'class-validator';

export class AskSomnikDto {
  @IsString()
  @MinLength(2)
  message!: string;
}
