import { BaseWindowService } from './BaseWindowService.js';

export class ServerWindowService extends BaseWindowService {
  min(): void {
    console.warn('Server environment does not support window operations');
  }

  max(): void {
    console.warn('Server environment does not support window operations');
  }

  close(): void {
    console.warn('Server environment does not support window operations');
  }
}
