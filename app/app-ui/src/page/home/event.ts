import eventBridge, { typedEmit, typedOn } from "@/lib/eventBridge";

interface HomeEvents {
  'module:action': { payload: string };
  'data:update': { data: any };
  'data:fetch': { success: boolean; data?: any };
}

export class HomeEventManager {
  private static instance: HomeEventManager;
  private listeners: Record<string, (...args: any[]) => void> = {};

  private constructor() {}

  public static getInstance(): HomeEventManager {
    if (!HomeEventManager.instance) {
      HomeEventManager.instance = new HomeEventManager();
    }
    return HomeEventManager.instance;
  }

  // 发送模块动作事件
  public sendAction(payload: string) {
    typedEmit('module:action', { payload });
  }

  // 获取数据
  public async fetchData(): Promise<{ success: boolean; data?: any }> {
    return eventBridge.invoke('data:fetch');
  }

  // 监听数据更新
  public onDataUpdate(listener: (data: { data: any }) => void) {
    typedOn('data:update', listener);
    this.listeners['data:update'] = listener;
  }

  // 清理监听
  public cleanup() {
    Object.entries(this.listeners).forEach(([event, listener]) => {
      eventBridge.off?.(event, listener);
    });
    this.listeners = {};
  }
}
