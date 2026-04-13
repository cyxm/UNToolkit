import { BaseSystemService } from './BaseSystemService.js';

export class ServerSystemService extends BaseSystemService {
  async getOS(): Promise<string> {
    const response = await fetch('/api/system/os');
    if (response.ok) {
      const data = await response.json();
      return data.os;
    }
    return 'server';
  }

  async showMessageBox(message: string): Promise<void> {
    await fetch('/api/system/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  }
}
