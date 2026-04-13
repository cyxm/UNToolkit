import { BaseService } from '../common/BaseService.js';
import { GraphData } from '@/page/graph/types.js';

export interface CollectionInfo {
  name: string;
  path?: string;
  lastOpened?: number;
}

export abstract class BaseFileService extends BaseService {
  abstract save(name: string, data: GraphData, collectionName?: string): Promise<void>;
  abstract load(name: string): Promise<GraphData | null>;
  abstract list(): Promise<string[]>;
  abstract delete(name: string): Promise<void>;

  // 图形集管理方法
  abstract listCollections(): Promise<CollectionInfo[]>;
  abstract createCollection(name: string, path?: string): Promise<void>;
  abstract deleteCollection(name: string): Promise<void>;
  abstract listFilesInCollection(collection: string): Promise<string[]>;
  abstract saveToCollection(collection: string, name: string, data: GraphData): Promise<void>;
  abstract loadFromCollection(collection: string, name: string): Promise<GraphData | null>;
  abstract deleteFromCollection(collection: string, name: string): Promise<void>;
  
  // 选择本地路径
  abstract selectDirectory(): Promise<string | null>;
  
  // 获取当前图形集路径
  abstract getCollectionPath(name: string): string | null;
  
  // 获取默认文件夹路径
  abstract getDefaultFolder(): Promise<string>;

  async exportFile(name: string, data: GraphData): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importFile(): Promise<{ name: string; data: GraphData } | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          try {
            const data = JSON.parse(text) as GraphData;
            const name = file.name.replace('.json', '');
            resolve({ name, data });
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }
}
