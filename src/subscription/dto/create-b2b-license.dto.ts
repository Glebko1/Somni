import { IsInt, IsString, Min } from 'class-validator';

export class CreateB2BLicenseDto {
  @IsString()
  organizationName!: string;

  @IsInt()
  @Min(1)
  seats!: number;

  @IsInt()
  @Min(1)
  months!: number;
}
