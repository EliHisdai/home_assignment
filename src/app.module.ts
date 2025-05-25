import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { PatientsModule } from './patients/patients.module';
import { SamplesModule } from './samples/samples.module';
import { AuditModule } from './audit/audit.module';
import { JsonDatabaseService } from './common/services/json-database.service';
import { RequestTrackerMiddleware } from './common/middleware/request-tracker.middleware';

@Module({
  imports: [
    CommonModule, // add this line first
    PatientsModule,
    SamplesModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestTrackerMiddleware).forRoutes("*");
  }
}
