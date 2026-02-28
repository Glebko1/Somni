import { IsBoolean, IsInt, IsOptional, Min, Max } from 'class-validator';

export class TriageCheckDto {
  @IsInt()
  @Min(0)
  @Max(27)
  phq9Score!: number;

  @IsBoolean()
  suicidalIdeation!: boolean;

  @IsBoolean()
  apneaRisk!: boolean;

  @IsOptional()
  @IsBoolean()
  severeWorsening?: boolean;
}
