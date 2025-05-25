import { ApiProperty } from '@nestjs/swagger';

export class AuditLog {
  @ApiProperty({ description: 'ID of the patient', example: '1' })
  patientId: string;

  @ApiProperty({ description: 'Number of requests for patient data', example: 5 })
  patients: number;

  @ApiProperty({ description: 'Number of requests for sample data', example: 10 })
  samples: number;

  @ApiProperty({ description: 'Timestamp of the last request', example: '2025-05-23T14:30:00Z' })
  timestamp: string;
}
