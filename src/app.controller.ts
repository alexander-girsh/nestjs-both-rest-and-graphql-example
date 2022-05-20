import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Utility')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Redirects to this docs',
  })
  @Redirect('/apidocs')
  getIndex() {
    return 'REDIRECTING...';
  }

  @Get('/healthz')
  @ApiOperation({
    summary: 'Basic health check. Liveness probes only.',
  })
  @ApiOkResponse({
    description: 'Application is running',
  })
  getHealthz(): string {
    return 'OK';
  }
}
