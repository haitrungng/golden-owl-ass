import { IsString, Matches } from 'class-validator';

export class SbdParamDto {
  @IsString()
  @Matches(/^\d{8}$/, { message: 'SBD must be an 8-digit string' })
  sbd!: string;
}
