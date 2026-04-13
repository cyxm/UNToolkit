import { env } from './common/env.js';
import { BaseFileService } from './file/BaseFileService.js';
import { BrowserFileService } from './file/BrowserFileService.js';
import { ElectronFileService } from './file/ElectronFileService.js';
import { ServerFileService } from './file/ServerFileService.js';
import { BaseSystemService } from './system/BaseSystemService.js';
import { BrowserSystemService } from './system/BrowserSystemService.js';
import { ElectronSystemService } from './system/ElectronSystemService.js';
import { ServerSystemService } from './system/ServerSystemService.js';
import { BaseWindowService } from './window/BaseWindowService.js';
import { BrowserWindowService } from './window/BrowserWindowService.js';
import { ElectronWindowService } from './window/ElectronWindowService.js';
import { ServerWindowService } from './window/ServerWindowService.js';

export class ServiceFactory {
  private static instances: Map<string, any> = new Map();

  static createFileService(environment = env): BaseFileService {
    const key = `file-${environment}`;
    if (!this.instances.has(key)) {
      switch (environment) {
        case 'electron':
          this.instances.set(key, new ElectronFileService());
          break;
        case 'browser':
          this.instances.set(key, new BrowserFileService());
          break;
        case 'server':
          this.instances.set(key, new ServerFileService());
          break;
        default:
          this.instances.set(key, new BrowserFileService());
      }
    }
    return this.instances.get(key);
  }

  static createSystemService(environment = env): BaseSystemService {
    const key = `system-${environment}`;
    if (!this.instances.has(key)) {
      switch (environment) {
        case 'electron':
          this.instances.set(key, new ElectronSystemService());
          break;
        case 'browser':
          this.instances.set(key, new BrowserSystemService());
          break;
        case 'server':
          this.instances.set(key, new ServerSystemService());
          break;
        default:
          this.instances.set(key, new BrowserSystemService());
      }
    }
    return this.instances.get(key);
  }

  static createWindowService(environment = env): BaseWindowService {
    const key = `window-${environment}`;
    if (!this.instances.has(key)) {
      switch (environment) {
        case 'electron':
          this.instances.set(key, new ElectronWindowService());
          break;
        case 'browser':
          this.instances.set(key, new BrowserWindowService());
          break;
        case 'server':
          this.instances.set(key, new ServerWindowService());
          break;
        default:
          this.instances.set(key, new BrowserWindowService());
      }
    }
    return this.instances.get(key);
  }

  static get fileService(): BaseFileService {
    return this.createFileService();
  }

  static get systemService(): BaseSystemService {
    return this.createSystemService();
  }

  static get windowService(): BaseWindowService {
    return this.createWindowService();
  }
}

export const fileService = ServiceFactory.fileService;
export const systemService = ServiceFactory.systemService;
export const windowService = ServiceFactory.windowService;