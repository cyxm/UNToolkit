import { BaseWindowService } from './BaseWindowService.js';

export class BrowserWindowService extends BaseWindowService {
  min(): void {
    console.warn('Browser environment does not support window minimization');
  }

  max(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  close(): void {
    if (confirm('确定要关闭页面吗？')) {
      window.close();
    }
  }
}
