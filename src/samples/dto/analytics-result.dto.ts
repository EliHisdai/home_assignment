import { ApiProperty } from '@nestjs/swagger';
import { AggregationType } from './sample-analytics.dto';

export class AnalyticsResultDto {
  @ApiProperty({ description: 'Patient ID', example: 'P12345' })
  patientId: string;

  @ApiProperty({ description: 'Average heart rate', example: 72, required: false })
  [AggregationType.AVG]?: number;

  @ApiProperty({ description: 'Minimum heart rate', example: 60, required: false })
  [AggregationType.MIN]?: number;

  @ApiProperty({ description: 'Maximum heart rate', example: 120, required: false })
  [AggregationType.MAX]?: number;
}
