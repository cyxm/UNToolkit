import { BaseSystemService } from './BaseSystemService.js';

export class BrowserSystemService extends BaseSystemService {
  async getOS(): Promise<string> {
    return 'browser';
  }

  async showMessageBox(message: string): Promise<void> {
    alert(message);
  }
}
