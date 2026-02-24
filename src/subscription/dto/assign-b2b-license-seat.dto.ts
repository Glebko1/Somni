import { IsString } from 'class-validator';

export class AssignB2BLicenseSeatDto {
  @IsString()
  userId!: string;
}
