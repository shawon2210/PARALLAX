import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateAccessRequestDto } from '../../dto/create-access-request.dto';
import { AccessService } from './access.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';

@UseGuards(ThrottlerGuard)
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('request')
  async requestAccess(@Body(ValidationPipe) dto: CreateAccessRequestDto) {
    const result = this.accessService.requestAccess(dto);
    return {
      success: true,
      message: 'Access request received',
      queuePosition: result.queuePosition,
      requestId: result.request.id,
    };
  }

  @Get('queue')
  getQueuePosition(@Query('email') email: string) {
    if (!email || typeof email !== 'string') {
      return { success: false, message: 'Email query parameter is required' };
    }
    const position = this.accessService.getQueuePosition(email);
    if (position === null) {
      return { success: false, message: 'Email not found in queue' };
    }
    return { success: true, queuePosition: position };
  }
}
