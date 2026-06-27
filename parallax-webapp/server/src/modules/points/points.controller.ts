import { Controller, Get } from '@nestjs/common';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('live')
  getLivePoints() {
    return this.pointsService.getCurrentPoints();
  }

  @Get('field')
  getFieldStatus() {
    return this.pointsService.getFieldStatus();;
  }
}
