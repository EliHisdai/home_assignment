import { ApiProperty } from '@nestjs/swagger';

export class Sample {
  @ApiProperty({ description: 'ID of the patient this sample belongs to', example: 'P12345' })
  patientId: string;

  @ApiProperty({
    description: 'Timestamp when the sample was taken (UTC)',
    example: '2025-05-22T14:30:00Z',
  })
  timestamp: string;

  @ApiProperty({ description: 'Heart rate measurement', example: 72 })
  heartRate: number;
}
