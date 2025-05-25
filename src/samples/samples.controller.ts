import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { FilterSampleDto } from './dto/filter-sample.dto';
import { SampleAnalyticsDto } from './dto/sample-analytics.dto';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Sample } from './entities/sample.entity';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('samples')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('samples')
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sample' })
  @ApiResponse({ status: 201, description: 'Sample created successfully', type: Sample })
  create(@Body() createSampleDto: CreateSampleDto): Promise<Sample> {
    return this.samplesService.create(createSampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all samples with optional filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated samples matching the filters',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/Sample' },
        },
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemsPerPage: { type: 'number' },
            currentPage: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  findAll(@Query() filterDto: FilterSampleDto) {
    return this.samplesService.findAll(filterDto);
  }

  @Post('analytics')
  @ApiOperation({ summary: 'Get analytics for samples' })
  @ApiResponse({ status: 200, description: 'Return analytics results', type: [AnalyticsResultDto] })
  getAnalytics(@Body() analyticsDto: SampleAnalyticsDto): Promise<AnalyticsResultDto[]> {
    return this.samplesService.getAnalytics(analyticsDto);
  }
}
