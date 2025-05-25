import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Gender } from '../entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty({ description: 'Unique identifier for the patient', example: 'P12345' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Full name of the patient', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Age of the patient', example: 45 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
