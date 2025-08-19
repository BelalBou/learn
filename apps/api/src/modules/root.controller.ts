import { Controller, Get } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  getRoot() {
    return { status: 'ok', service: 'learn-api', timestamp: new Date().toISOString() };
  }
}
