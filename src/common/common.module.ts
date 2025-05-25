import { Global, Module } from '@nestjs/common';
import { JsonDatabaseService } from './services/json-database.service';
import { LogService } from './services/log.service';

/**
 * Common module provides application-wide services
 * Such as logging and database services
 */
@Global()
@Module({
  providers: [LogService, JsonDatabaseService],
  exports: [LogService, JsonDatabaseService],
})
export class CommonModule {}
