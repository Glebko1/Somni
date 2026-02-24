import { IsString, MinLength } from 'class-validator';

export class CreateDreamDto {
  @IsString()
  @MinLength(10)
  dreamText!: string;
}
