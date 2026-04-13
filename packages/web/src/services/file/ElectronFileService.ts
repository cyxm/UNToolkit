import { BaseFileService, CollectionInfo } from './BaseFileService.js';
import { GraphData } from '@/page/graph/types.js';

export class ElectronFileService extends BaseFileService {
  async save(name: string, data: GraphData, collectionName?: string): Promise<void> {
    if (collectionName) {
      // 对于图形集中的文件，使用saveToCollection方法
      await this.saveToCollection(collectionName, name, data);
    } else {
      // 对于非图形集的文件，直接保存，不弹出对话框
      if (this.electronAPI?.file?.writeFile) {
        const success = await this.electronAPI.file.writeFile(name, JSON.stringify(data, null, 2));
        if (!success) {
          throw new Error('保存失败');
        }
      } else if (this.electronAPI?.file?.saveAs) {
        // 如果没有writeFile方法，回退到saveAs
        const savedName = await this.electronAPI.file.saveAs(name, JSON.stringify(data, null, 2));
        if (!savedName) {
          throw new Error('Save cancelled');
        }
      } else {
        throw new Error('Save API not available');
      }
    }
  }

  async load(name: string): Promise<GraphData | null> {
    if (this.electronAPI?.file?.readFile) {
      const content = await this.electronAPI.file.readFile(name);
      if (content) {
        return JSON.parse(content);
      }
      return null;
    }
    throw new Error('ReadFile API not available');
  }

  async list(): Promise<string[]> {
    if (this.electronAPI?.file?.list) {
      return await this.electronAPI.file.list();
    }
    throw new Error('List API not available');
  }

  async delete(name: string): Promise<void> {
    if (this.electronAPI?.file?.delete) {
      await this.electronAPI.file.delete(name);
    } else {
      throw new Error('Delete API not available');
    }
  }

  async importFile(): Promise<{ name: string; data: GraphData } | null> {
    if (this.electronAPI?.file?.import) {
      const result = await this.electronAPI.file.import();
      if (result) {
        return {
          name: result.name,
          data: JSON.parse(result.content),
        };
      }
      return null;
    }
    return super.importFile();
  }

  async listCollections(): Promise<CollectionInfo[]> {
    // 暂时使用 localStorage 存储图形集信息
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
    if (this.electronAPI?.file?.createCollection) {
      const success = await this.electronAPI.file.createCollection(name, path);
      if (!success) {
        throw new Error('创建文件夹失败');
      }
    }
    const collectionData = {
      name,
      path: path || '',
      timestamp: Date.now(),
      lastOpened: Date.now(),
    };
    localStorage.setItem(`collection-${name}`, JSON.stringify(collectionData));
  }

  async deleteCollection(name: string): Promise<void> {
    const collectionPath = this.getCollectionPath(name);
    if (this.electronAPI?.file?.deleteCollection) {
      await this.electronAPI.file.deleteCollection(name, collectionPath);
    }
    localStorage.removeItem(`collection-${name}`);
    // 同时删除该图形集中的所有文件
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`file-${name}-`)) {
        localStorage.removeItem(key);
      }
    });
  }

  async listFilesInCollection(collection: string): Promise<string[]> {
    const collectionPath = this.getCollectionPath(collection);
    if (this.electronAPI?.file?.listFilesInCollection) {
      const files = await this.electronAPI.file.listFilesInCollection(collection, collectionPath);
      if (files.length > 0) {
        return files;
      }
    }
    // 从 localStorage 读取作为备份
    const files: string[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`file-${collection}-`)) {
        const parts = key.split('-');
        if (parts.length >= 3) {
          files.push(parts.slice(2).join('-'));
        }
      }
    });
    return files;
  }

  async saveToCollection(collection: string, name: string, data: GraphData): Promise<void> {
    const collectionPath = this.getCollectionPath(collection);
    if (this.electronAPI?.file?.saveToCollection) {
      const success = await this.electronAPI.file.saveToCollection(collection, name, JSON.stringify(data, null, 2), collectionPath);
      if (!success) {
        throw new Error('保存文件失败');
      }
    }
    // 同时在 localStorage 中保存一份
    localStorage.setItem(`file-${collection}-${name}`, JSON.stringify(data));
    // 更新图形集的最后打开时间
    const collectionKey = `collection-${collection}`;
    const stored = localStorage.getItem(collectionKey);
    if (stored) {
      const collectionData = JSON.parse(stored);
      collectionData.lastOpened = Date.now();
      localStorage.setItem(collectionKey, JSON.stringify(collectionData));
    }
  }

  async loadFromCollection(collection: string, name: string): Promise<GraphData | null> {
    const collectionPath = this.getCollectionPath(collection);
    if (this.electronAPI?.file?.loadFromCollection) {
      const content = await this.electronAPI.file.loadFromCollection(collection, name, collectionPath);
      if (content) {
        // 更新图形集的最后打开时间
        const collectionKey = `collection-${collection}`;
        const stored = localStorage.getItem(collectionKey);
        if (stored) {
          const collectionData = JSON.parse(stored);
          collectionData.lastOpened = Date.now();
          localStorage.setItem(collectionKey, JSON.stringify(collectionData));
        }
        return JSON.parse(content);
      }
    }
    // 从 localStorage 加载作为备份
    const data = localStorage.getItem(`file-${collection}-${name}`);
    if (data) {
      // 更新图形集的最后打开时间
      const collectionKey = `collection-${collection}`;
      const stored = localStorage.getItem(collectionKey);
      if (stored) {
        const collectionData = JSON.parse(stored);
        collectionData.lastOpened = Date.now();
        localStorage.setItem(collectionKey, JSON.stringify(collectionData));
      }
      return JSON.parse(data);
    }
    return null;
  }

  async deleteFromCollection(collection: string, name: string): Promise<void> {
    const collectionPath = this.getCollectionPath(collection);
    if (this.electronAPI?.file?.deleteFromCollection) {
      await this.electronAPI.file.deleteFromCollection(collection, name, collectionPath);
    }
    localStorage.removeItem(`file-${collection}-${name}`);
  }

  async selectDirectory(): Promise<string | null> {
    if (this.electronAPI?.file?.selectDirectory) {
      return await this.electronAPI.file.selectDirectory();
    }
    return null;
  }

  getCollectionPath(name: string): string | null {
    const stored = localStorage.getItem(`collection-${name}`);
    if (stored) {
      const data = JSON.parse(stored);
      return data.path || null;
    }
    return null;
  }

  async getDefaultFolder(): Promise<string> {
    if (this.electronAPI?.file?.getDefaultFolder) {
      const folder = await this.electronAPI.file.getDefaultFolder();
      if (folder) {
        return folder;
      }
    }
    // 默认返回用户文档目录
    return '';
  }
}
