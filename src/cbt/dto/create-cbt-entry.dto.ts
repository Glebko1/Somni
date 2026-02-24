import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateCbtEntryDto {
  @IsString()
  trigger!: string;

  @IsString()
  thought!: string;

  @IsString()
  reframedThought!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  moodBefore!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  moodAfter!: number;
}
