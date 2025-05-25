import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Redirect to API documentation' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Swagger documentation',
  })
  navigateToSwagger() {
    // redirects to the Swagger documentation
  }
}
