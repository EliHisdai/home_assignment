import { ApiProperty } from '@nestjs/swagger';

export class AuditRequestsDto {
  @ApiProperty({ description: 'ID of the patient', example: '1' })
  patientId: string;

  @ApiProperty({ description: 'Number of requests for patient data', example: 5 })
  patients: number;

  @ApiProperty({ description: 'Number of requests for sample data', example: 10 })
  samples: number;
}
