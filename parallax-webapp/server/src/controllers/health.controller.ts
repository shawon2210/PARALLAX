import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health(): { status: string; timestamp: string; version: string; uptime?: number } {
    const result = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime ? process.uptime() : undefined,
    };
    return result;
  }
}
