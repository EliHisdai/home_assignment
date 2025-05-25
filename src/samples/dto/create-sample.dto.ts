import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class CreateSampleDto {
  @ApiProperty({ description: 'ID of the patient this sample belongs to', example: 'P12345' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({
    description: 'Timestamp when the sample was taken (UTC)',
    example: '2025-05-22T14:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  timestamp: string;

  @ApiProperty({ description: 'Heart rate measurement', example: 72 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(300)
  heartRate: number;
}
