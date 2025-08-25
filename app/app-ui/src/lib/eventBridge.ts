import mitt from 'mitt';

type Events = {
  [key: string]: any;
};

const emitter = mitt<Events>();

export class EventBridge {
  static emit(event: string, payload?: any) {
    emitter.emit(event, payload);
  }

  static on(event: string, handler: (payload?: any) => void) {
    emitter.on(event, handler);
  }

  static off(event: string, handler?: (payload?: any) => void) {
    if (handler) {
      emitter.off(event, handler);
    } else {
      emitter.all.clear();
    }
  }
}
