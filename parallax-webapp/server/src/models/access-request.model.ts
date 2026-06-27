import { v4 as uuidv4 } from 'uuid';

export interface AccessRequest {
  id: string;
  email: string;
  queuePosition: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export class AccessRequestEntity implements AccessRequest {
  id: string;
  email: string;
  queuePosition: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;

  constructor(email: string, queuePosition: number) {
    this.id = uuidv4();
    this.email = email;
    this.queuePosition = queuePosition;
    this.status = 'pending';
    this.createdAt = new Date();
  }
}
