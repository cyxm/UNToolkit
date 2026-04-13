import { BaseWindowService } from './BaseWindowService.js';
import { BrowserWindowService } from './BrowserWindowService.js';

export class ElectronWindowService extends BaseWindowService {
  private fallbackService: BrowserWindowService;

  constructor() {
    super();
    this.fallbackService = new BrowserWindowService();
  }

  min(): void {
    if (this.electronAPI?.window?.min) {
      this.electronAPI.window.min();
    } else {
      this.fallbackService.min();
    }
  }

  max(): void {
    if (this.electronAPI?.window?.max) {
      this.electronAPI.window.max();
    } else {
      this.fallbackService.max();
    }
  }

  close(): void {
    if (this.electronAPI?.window?.close) {
      this.electronAPI.window.close();
    } else {
      this.fallbackService.close();
    }
  }
}
