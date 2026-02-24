import { Type } from 'class-transformer';
import { IsDate, IsInt, Max, Min } from 'class-validator';

export class CreateSleepDto {
  @Type(() => Date)
  @IsDate()
  sleepStart!: Date;

  @Type(() => Date)
  @IsDate()
  wakeUp!: Date;

  @IsInt()
  @Min(0)
  @Max(20)
  interruptions!: number;

  @IsInt()
  @Min(0)
  deepSleepMinutes!: number;

  @IsInt()
  @Min(0)
  remMinutes!: number;
}
