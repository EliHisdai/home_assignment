import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @Redirect('/api')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Redirect to API documentation' })
  navigateToSwagger() {
    // redirects to the Swagger documentation
  }
}
