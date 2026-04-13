import { BaseFileService, CollectionInfo } from './BaseFileService.js';
import { GraphData } from '@/page/graph/types.js';

export class BrowserFileService extends BaseFileService {
  private getKey(name: string): string {
    return `graph-${name}`;
  }

  private getCollectionKey(collection: string): string {
    return `collection-${collection}`;
  }

  private getFileInCollectionKey(collection: string, name: string): string {
    return `collection-${collection}-${name}`;
  }

  async save(name: string, data: GraphData, collectionName?: string): Promise<void> {
    const fileData = {
      name,
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(this.getKey(name), JSON.stringify(fileData));
  }

  async load(name: string): Promise<GraphData | null> {
    const stored = localStorage.getItem(this.getKey(name));
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.data;
    }
    return null;
  }

  async list(): Promise<string[]> {
    const files: string[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('graph-')) {
        const parts = key.split('-');
        if (parts.length === 2) {
          files.push(parts[1]);
        }
      }
    });
    return files;
  }

  async delete(name: string): Promise<void> {
    localStorage.removeItem(this.getKey(name));
  }

  // 图形集管理方法
  async listCollections(): Promise<CollectionInfo[]> {
    const collections: CollectionInfo[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('collection-')) {
        const parts = key.split('-');
        if (parts.length === 2) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);
            collections.push({
              name: parts[1],
              path: data.path,
              lastOpened: data.lastOpened,
            });
          }
        }
      }
    });
    return collections.sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0));
  }

  async createCollection(name: string, path?: string): Promise<void> {
    const collectionData = {
      name,
      path: path || '',
      timestamp: Date.now(),
      lastOpened: Date.now(),
    };
    localStorage.setItem(this.getCollectionKey(name), JSON.stringify(collectionData));
  }

  async deleteCollection(name: string): Promise<void> {
    localStorage.removeItem(this.getCollectionKey(name));
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`collection-${name}-`)) {
        localStorage.removeItem(key);
      }
    });
  }

  async listFilesInCollection(collection: string): Promise<string[]> {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(`collection-${collection}-`))
      .map((key) => key.replace(`collection-${collection}-`, ''));
  }

  async saveToCollection(collection: string, name: string, data: GraphData): Promise<void> {
    const fileData = {
      name,
      collection,
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(this.getFileInCollectionKey(collection, name), JSON.stringify(fileData));
    
    // 更新图形集的 lastOpened
    const stored = localStorage.getItem(this.getCollectionKey(collection));
    if (stored) {
      const collectionData = JSON.parse(stored);
      collectionData.lastOpened = Date.now();
      localStorage.setItem(this.getCollectionKey(collection), JSON.stringify(collectionData));
    }
  }

  async loadFromCollection(collection: string, name: string): Promise<GraphData | null> {
    const stored = localStorage.getItem(this.getFileInCollectionKey(collection, name));
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // 更新图形集的 lastOpened
      const collectionStored = localStorage.getItem(this.getCollectionKey(collection));
      if (collectionStored) {
        const collectionData = JSON.parse(collectionStored);
        collectionData.lastOpened = Date.now();
        localStorage.setItem(this.getCollectionKey(collection), JSON.stringify(collectionData));
      }
      
      return parsed.data;
    }
    return null;
  }

  async deleteFromCollection(collection: string, name: string): Promise<void> {
    localStorage.removeItem(this.getFileInCollectionKey(collection, name));
  }

  async selectDirectory(): Promise<string | null> {
    try {
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        return dirHandle.name || '已选择目录';
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('选择目录失败:', error);
      }
    }
    alert('浏览器环境暂不支持选择本地目录，请在 Electron 环境中使用此功能。您可以直接在输入框中输入路径或留空。');
    return null;
  }

  getCollectionPath(name: string): string | null {
    const stored = localStorage.getItem(this.getCollectionKey(name));
    if (stored) {
      const data = JSON.parse(stored);
      return data.path || null;
    }
    return null;
  }

  async getDefaultFolder(): Promise<string> {
    // 浏览器环境下返回空字符串
    return '';
  }
}
