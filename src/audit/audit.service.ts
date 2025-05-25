import { Injectable } from '@nestjs/common';
import { AuditRequestsDto } from './dto/audit-requests.dto';
import { JsonDatabaseService } from '../common/services/json-database.service';
import { AuditLog } from './entities/audit-log.entity';
import { DATABASE, ENTITY_NAMES } from 'src/common/constants';
import { promises } from 'dns';
import { LogService } from 'src/common/services/log.service';

@Injectable()
export class AuditService {
  constructor(
    private readonly databaseService: JsonDatabaseService,
    private readonly logService: LogService,
  ) {}

  async getRequestsByPatient(): Promise<AuditRequestsDto[]> {
    const auditLogs = await this.databaseService.getCollection<AuditLog>(DATABASE.COLLECTIONS.AUDIT_LOGS);

    return auditLogs.map(log => ({
      patientId: log.patientId,
      patients: log.patients || 0,
      samples: log.samples || 0,
    }));
  }

  async addPatientRequests(patientIds: string[], entityType: ENTITY_NAMES): Promise<void> {
    try {
      const auditLogs = await this.databaseService.getCollection<any>('auditLogs');

      for (const patientId of patientIds) {
        // Find existing log
        let existingLog = auditLogs.find(log => log.patientId === patientId);

        if (existingLog) {
          // Update counts
          existingLog.patients += entityType === ENTITY_NAMES.PATIENT ? 1 : 0;
          existingLog.samples += entityType === ENTITY_NAMES.SAMPLE ? 1 : 0;
          existingLog.timestamp = new Date().toISOString();
        } else {
          // Create new log
          const newLog = {
            patientId,
            patients: entityType === ENTITY_NAMES.PATIENT ? 1 : 0,
            samples: entityType === ENTITY_NAMES.SAMPLE ? 1 : 0,
            timestamp: new Date().toISOString(),
          };
          auditLogs.push(newLog);
          existingLog = newLog;
        }

        this.logService.log(`Incremented counter request for '${patientId}' (${entityType})`);
      }
      await this.databaseService.saveCollection('auditLogs', auditLogs);
    } catch (error) {
      this.logService.error('Error logging request:', error);
    }
  }
}
