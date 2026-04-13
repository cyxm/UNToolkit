import { BaseService } from '../common/BaseService.js';

export abstract class BaseWindowService extends BaseService {
  abstract min(): void;
  abstract max(): void;
  abstract close(): void;
}
