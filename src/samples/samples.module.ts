import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { JsonDatabaseService } from '../common/services/json-database.service';
import { CommonModule } from 'src/common/common.module';
import { AuditModule } from 'src/audit/audit.module';
import { AuditService } from 'src/audit/audit.service';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [CommonModule, PatientsModule, AuditModule],
  controllers: [SamplesController],
  providers: [SamplesService],
  exports: [SamplesService],
})
export class SamplesModule {}
