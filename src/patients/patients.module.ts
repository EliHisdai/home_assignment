import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { JsonDatabaseService } from '../common/services/json-database.service';
import { CommonModule } from 'src/common/common.module';
import { LogService } from 'src/common/services/log.service';
import { AuditModule } from 'src/audit/audit.module';
import { AuditService } from 'src/audit/audit.service';

@Module({
  imports: [CommonModule, AuditModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
