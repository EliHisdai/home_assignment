import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { JsonDatabaseService } from '../common/services/json-database.service';
import { CommonModule } from 'src/common/common.module';
import { AuditModule } from 'src/audit/audit.module';
import { AuditService } from 'src/audit/audit.service';

@Module({
  imports: [CommonModule, AuditModule],
  controllers: [SamplesController],
  providers: [SamplesService],
  exports: [SamplesService],
})
export class SamplesModule {}
