export interface DepthPoint {
  id: string;
  label: string;
  zone: 'Z-000' | 'Z-001' | 'Z-002' | 'Z-003';
  depth: number;
  active: boolean;
  timestamp: Date;
}
