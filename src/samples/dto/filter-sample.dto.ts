import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterSampleDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID of the patient', example: 'P12345' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({
    description: 'Start timestamp (UTC) for filtering',
    example: '2025-05-20T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startTimestamp?: string;

  @ApiPropertyOptional({
    description: 'End timestamp (UTC) for filtering',
    example: '2025-05-23T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endTimestamp?: string;

  @ApiPropertyOptional({ description: 'Minimum heart rate value', example: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minHeartrate?: number;

  @ApiPropertyOptional({ description: 'Maximum heart rate value', example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(300)
  maxHeartrate?: number;
}
