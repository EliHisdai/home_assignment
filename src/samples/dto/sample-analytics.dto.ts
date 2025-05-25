import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsDateString, IsOptional, IsArray } from 'class-validator';

export enum MeasurementType {
  HEARTRATE = 'heartRate',
}

export enum AggregationType {
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
}

export class SampleAnalyticsDto {
  @ApiProperty({
    description: 'Type of measurement to analyze',
    enum: MeasurementType,
    example: MeasurementType.HEARTRATE,
    default: MeasurementType.HEARTRATE,
  })
  @IsNotEmpty()
  @IsEnum(MeasurementType)
  measurementType: MeasurementType;

  @ApiProperty({
    description: 'Type of aggregation to perform',
    enum: AggregationType,
    isArray: true,
    example: [AggregationType.AVG, AggregationType.MIN, AggregationType.MAX],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(AggregationType, { each: true })
  aggregationTypes: AggregationType[];

  @ApiProperty({
    description: 'Start timestamp (UTC) for analytics',
    example: '2025-05-20T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End timestamp (UTC) for analytics',
    example: '2025-05-23T23:59:59Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    description: 'Optional patient ID to filter analytics',
    example: 'P12345',
  })
  @IsOptional()
  patientId?: string;
}
