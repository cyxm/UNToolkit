interface HomeEvents {
  'module:action': { payload: string };
  'data:update': { data: any };
  'data:fetch': { success: boolean; data?: any };
}

// 定义事件接口
export interface IHomeEventManager {
  sendAction(payload: string): void;
}

// 实现事件接口
export class HomeEventManager implements IHomeEventManager {
  private static instance: HomeEventManager;
  private listeners: Record<string, (...args: any[]) => void> = {};

  private constructor() { }

  public static getInstance(): IHomeEventManager {
    if (!HomeEventManager.instance) {
      HomeEventManager.instance = new HomeEventManager();
    }
    return HomeEventManager.instance;
  }

  // 静态方法
  public static sendAction(payload: string) {
    return HomeEventManager.getInstance().sendAction(payload);
  }
}
