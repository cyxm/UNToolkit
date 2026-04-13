export abstract class BaseService {
  protected get electronAPI() {
    return (window as any).electron;
  }

  protected get isElectron(): boolean {
    return typeof window !== 'undefined' && this.electronAPI;
  }

  protected get isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  protected get isServer(): boolean {
    return typeof window === 'undefined';
  }
}
