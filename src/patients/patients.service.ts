import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { JsonDatabaseService } from '../common/services/json-database.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
import { EntityAlreadyExistsException } from '../common/exceptions/entity-already-exists.exception';
import { AuditService } from 'src/audit/audit.service';
import { LogService } from 'src/common/services/log.service';
import { DATABASE, ENTITY_NAMES } from 'src/common/constants';

/**
 * Patients service responsible for managing patient data
 * Handles CRUD operations for patients using the JSON database service
 */
@Injectable()
export class PatientsService {
  constructor(
    private readonly databaseService: JsonDatabaseService,
    private readonly logService: LogService,
    private readonly auditService: AuditService,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patients = await this.databaseService.getCollection<Patient>('patients');

    // Check if patient with this ID already exists
    const existingPatient = patients.find(p => p.id === createPatientDto.id);
    if (existingPatient) {
      throw new EntityAlreadyExistsException(ENTITY_NAMES.PATIENT, createPatientDto.id);
    }

    const newPatient: Patient = {
      ...createPatientDto,
    };

    patients.push(newPatient);
    await this.databaseService.saveCollection(DATABASE.COLLECTIONS.PATIENTS, patients);
    return newPatient;
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<Patient>> {
    const patients = await this.databaseService.getCollection<Patient>(DATABASE.COLLECTIONS.PATIENTS);

    // If no pagination requested, return all patients with basic metadata
    if (!paginationDto) {
      return {
        items: patients,
        meta: {
          totalItems: patients.length,
          itemsPerPage: patients.length,
          currentPage: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // Apply pagination
    const page = paginationDto.page || 0;
    const limit = paginationDto.limit || 10;
    const skip = page * limit;

    const paginatedPatients = patients.slice(skip, skip + limit);
    const totalPages = Math.ceil(patients.length / limit);

    const itemIds = paginatedPatients.map(p => p.id);
    this.auditService.addPatientRequests(itemIds, ENTITY_NAMES.PATIENT);
    this.logService.log(`Retrieved ${paginatedPatients.length} patients for page ${page + 1}`, 'PatientsService');

    return {
      items: paginatedPatients,
      meta: {
        totalItems: patients.length,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages - 1,
        hasPrevPage: page > 0,
      },
    };
  }

  async findOne(id: string): Promise<Patient> {
    this.auditService.addPatientRequests([id], ENTITY_NAMES.PATIENT);
    const patients = this.databaseService.getCollection<Patient>(DATABASE.COLLECTIONS.PATIENTS);
    const patient = patients.find(p => p.id === id);

    if (!patient) {
      throw new EntityNotFoundException(ENTITY_NAMES.PATIENT, id);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const updatedPatient = this.databaseService.updateItem<Patient>(DATABASE.COLLECTIONS.PATIENTS, id, updatePatientDto);

    return updatedPatient;
  }

  async remove(id: string): Promise<void> {
    let success = this.databaseService.deleteItem<Patient>(DATABASE.COLLECTIONS.PATIENTS, id);

    if (!success) {
      throw new EntityNotFoundException(ENTITY_NAMES.PATIENT, id);
    }
  }
}
