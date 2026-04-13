import { BaseSystemService } from './BaseSystemService.js';
import { BrowserSystemService } from './BrowserSystemService.js';

export class ElectronSystemService extends BaseSystemService {
  private fallbackService: BrowserSystemService;

  constructor() {
    super();
    this.fallbackService = new BrowserSystemService();
  }

  async getOS(): Promise<string> {
    if (this.electronAPI?.system?.getOS) {
      return await this.electronAPI.system.getOS();
    }
    return this.fallbackService.getOS();
  }

  async showMessageBox(message: string): Promise<void> {
    if (this.electronAPI?.system?.showMessageBox) {
      await this.electronAPI.system.showMessageBox(message);
    } else {
      await this.fallbackService.showMessageBox(message);
    }
  }
}
