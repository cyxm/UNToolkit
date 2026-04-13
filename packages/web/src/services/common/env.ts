export type Environment = 'browser' | 'electron' | 'server';

export function detectEnvironment(): Environment {
  if (typeof window !== 'undefined') {
    if ((window as any).electron) {
      return 'electron';
    }
    return 'browser';
  }
  return 'server';
}

export const env = detectEnvironment();

export const isElectron = env === 'electron';
export const isBrowser = env === 'browser';
export const isServer = env === 'server';

declare global {
  interface Window {
    electron?: any;
  }
}
