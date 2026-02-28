import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateSleepLogDto {
  @IsDateString()
  bedtime!: string;

  @IsDateString()
  estimatedSleepTime!: string;

  @IsInt()
  @Min(0)
  @Max(360)
  sleepOnsetLatency!: number;

  @IsInt()
  @Min(0)
  @Max(30)
  awakeningsCount!: number;

  @IsInt()
  @Min(0)
  @Max(720)
  wakeAfterSleepOnset!: number;

  @IsInt()
  @Min(0)
  @Max(360)
  earlyFinalAwakening!: number;

  @IsDateString()
  outOfBedTime!: string;

  @IsInt()
  @Min(0)
  @Max(900)
  totalSleepTime!: number;

  @IsInt()
  @Min(60)
  @Max(960)
  timeInBed!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  sleepEfficiency!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  preSleepAnxiety!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  daytimeSleepiness!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  mood!: number;

  @IsBoolean()
  caffeineAfter14!: boolean;

  @IsBoolean()
  alcoholEvening!: boolean;

  @IsOptional()
  @IsString()
  exerciseTime?: string;

  @IsInt()
  @Min(0)
  @Max(180)
  morningLightMinutes!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  nightUrination!: number;

  @IsNumber()
  @Min(10)
  @Max(35)
  temperatureRoom!: number;

  @IsBoolean()
  deviceUseBeforeSleep!: boolean;
}
