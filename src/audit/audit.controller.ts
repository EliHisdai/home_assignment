import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditRequestsDto } from './dto/audit-requests.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post('patients')
  @ApiOperation({ summary: 'Get request count for patient' })
  @ApiResponse({ status: 200, description: 'Return request count', type: [AuditRequestsDto] })
  getRequests(): Promise<AuditRequestsDto[]> {
    return this.auditService.getRequestsByPatient();
  }
}
