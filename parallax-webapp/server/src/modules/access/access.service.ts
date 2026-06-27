import { Injectable } from '@nestjs/common';
import { CreateAccessRequestDto } from '../../dto/create-access-request.dto';
import { AccessRequestEntity } from '../../models/access-request.model';

@Injectable()
export class AccessService {
  private requests = new Map<string, AccessRequestEntity>(); // email -> request
  private queueCounter = 1200;
  private maxRequests = 10000;

  requestAccess(dto: CreateAccessRequestDto): { request: AccessRequestEntity; queuePosition: number } {
    const position = ++this.queueCounter;
    const request = new AccessRequestEntity(dto.email, position);
    
    this.requests.set(dto.email, request);
    
    if (this.requests.size > this.maxRequests) {
      const emails = Array.from(this.requests.keys());
      const emailToRemove = emails[0];
      if (emailToRemove) {
        this.requests.delete(emailToRemove);
      }
    }
    
    return { request, queuePosition: position };
  }

  getQueuePosition(email: string): number | null {
    const request = this.requests.get(email);
    return request ? request.queuePosition : null;
  }
}
