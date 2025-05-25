import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JsonDatabaseService } from '../services/json-database.service';
import { LogService } from '../services/log.service';

@Injectable()
export class RequestTrackerMiddleware implements NestMiddleware {
  constructor(
    private readonly databaseService: JsonDatabaseService,
    private readonly logService: LogService,
  ) {
    this.use = this.use.bind(this);
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logService.log(`Request: ${req.method} ${req.path}`);
    next();
  }
}
