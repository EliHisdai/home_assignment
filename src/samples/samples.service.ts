import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { FilterSampleDto } from './dto/filter-sample.dto';
import { Sample } from './entities/sample.entity';
import { JsonDatabaseService } from '../common/services/json-database.service';
import { SampleAnalyticsDto, AggregationType } from './dto/sample-analytics.dto';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { DATABASE, ENTITY_NAMES } from 'src/common/constants';
import { AuditService } from 'src/audit/audit.service';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class SamplesService {
  constructor(
    private readonly databaseService: JsonDatabaseService,
    private readonly auditService: AuditService,
    private readonly patientService: PatientsService, // Assuming this is used to validate patient IDs
  ) {}

  async create(createSampleDto: CreateSampleDto): Promise<Sample> {
    //verify patient exists
    await this.patientService.findOne(createSampleDto.patientId);

    const sample = this.databaseService.addItem<Sample>(DATABASE.COLLECTIONS.SAMPLES, createSampleDto);

    return sample;
  }

  async findAll(filterDto: FilterSampleDto): Promise<PaginatedResult<Sample>> {
    const samples = await this.databaseService.getCollection<Sample>(DATABASE.COLLECTIONS.SAMPLES);

    // Filter the samples
    const filteredSamples = samples.filter(sample => {
      // Apply all filters if they exist
      if (filterDto.patientId && sample.patientId !== filterDto.patientId) {
        return false;
      }

      if (filterDto.startTimestamp && new Date(sample.timestamp) < new Date(filterDto.startTimestamp)) {
        return false;
      }

      if (filterDto.endTimestamp && new Date(sample.timestamp) > new Date(filterDto.endTimestamp)) {
        return false;
      }

      if (filterDto.minHeartrate !== undefined && sample.heartRate < filterDto.minHeartrate) {
        return false;
      }

      if (filterDto.maxHeartrate !== undefined && sample.heartRate > filterDto.maxHeartrate) {
        return false;
      }

      return true;
    });

    // Apply pagination
    const page = filterDto.page || 0;
    const limit = filterDto.limit || 10;
    const skip = page * limit;

    const paginatedSamples = filteredSamples.slice(skip, skip + limit);
    const totalPages = Math.ceil(filteredSamples.length / limit);

    // audit samples
    const itemIds = [...new Set(paginatedSamples.map(p => p.patientId))];
    this.auditService.addPatientRequests(itemIds, ENTITY_NAMES.SAMPLE);

    return {
      items: paginatedSamples,
      meta: {
        totalItems: filteredSamples.length,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages - 1,
        hasPrevPage: page > 0,
      },
    };
  }

  async getAnalytics(analyticsDto: SampleAnalyticsDto): Promise<AnalyticsResultDto[]> {
    try {
      // Get all relevant samples within the time range
      const result = await this.findAll({
        patientId: analyticsDto.patientId,
        startTimestamp: analyticsDto.startTime,
        endTimestamp: analyticsDto.endTime,
      });

      // Extract just the items from the paginated result
      const samples = result.items;

      // Group samples by patientId
      const samplesByPatient = this.groupByPatientId(samples);

      var patientIds = Object.keys(samplesByPatient);
      this.auditService.addPatientRequests(patientIds, ENTITY_NAMES.SAMPLE);

      // Calculate analytics for each patient
      return patientIds.map(patientId => {
        const patientSamples = samplesByPatient[patientId];
        const result: AnalyticsResultDto = { patientId };

        // Apply requested aggregations
        analyticsDto.aggregationTypes.forEach(aggType => {
          switch (aggType) {
            case AggregationType.AVG:
              result[AggregationType.AVG] = this.calculateAvg(patientSamples);
              break;
            case AggregationType.MIN:
              result[AggregationType.MIN] = this.calculateMin(patientSamples);
              break;
            case AggregationType.MAX:
              result[AggregationType.MAX] = this.calculateMax(patientSamples);
              break;
          }
        });

        return result;
      });
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new NotFoundException('Patient not found');
      }
      throw new BadRequestException('Invalid request');
    }
  }

  private groupByPatientId(samples: Sample[]): Record<string, Sample[]> {
    return samples.reduce(
      (acc, sample) => {
        if (!acc[sample.patientId]) {
          acc[sample.patientId] = [];
        }
        acc[sample.patientId].push(sample);
        return acc;
      },
      {} as Record<string, Sample[]>,
    );
  }

  private calculateAvg(samples: Sample[]): number {
    if (samples.length === 0) return 0;
    const sum = samples.reduce((total, sample) => total + sample.heartRate, 0);
    return parseFloat((sum / samples.length).toFixed(2));
  }

  private calculateMin(samples: Sample[]): number {
    if (samples.length === 0) return 0;
    return Math.min(...samples.map(sample => sample.heartRate));
  }

  private calculateMax(samples: Sample[]): number {
    if (samples.length === 0) return 0;
    return Math.max(...samples.map(sample => sample.heartRate));
  }
}
