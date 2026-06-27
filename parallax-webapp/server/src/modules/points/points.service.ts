import { Injectable } from '@nestjs/common';

@Injectable()
export class PointsService {
  private basePoints = 3482;

  getCurrentPoints(): { total: number; delta: number } {
    const delta = Math.floor(Math.random() * 40) - 20;
    return { total: this.basePoints + delta, delta };
  }

  getFieldStatus(): { status: string; layers: number } {
    return { status: 'stable', layers: 4 };
  }
}
