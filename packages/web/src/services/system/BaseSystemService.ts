import { BaseService } from '../common/BaseService.js';

export abstract class BaseSystemService extends BaseService {
  abstract getOS(): Promise<string>;
  abstract showMessageBox(message: string): Promise<void>;
}
