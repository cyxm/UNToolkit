import { BaseFileService, CollectionInfo } from './BaseFileService.js';
import { GraphData } from '@/page/graph/types.js';

export class ServerFileService extends BaseFileService {
  private baseUrl = '/api/graph';

  async save(name: string, data: GraphData, collectionName?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, data, collectionName }),
    });
    if (!response.ok) throw new Error('Save failed');
  }

  async load(name: string): Promise<GraphData | null> {
    const response = await fetch(
      `${this.baseUrl}/load?name=${encodeURIComponent(name)}`
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  }

  async list(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/list`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  }

  async delete(name: string): Promise<void> {
    await fetch(`${this.baseUrl}/delete?name=${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  }

  async listCollections(): Promise<CollectionInfo[]> {
    const response = await fetch(`${this.baseUrl}/collections/list`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  }

  async createCollection(name: string, path?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, path }),
    });
    if (!response.ok) throw new Error('Create collection failed');
  }

  async deleteCollection(name: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/collections/delete?name=${encodeURIComponent(name)}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Delete collection failed');
  }

  async listFilesInCollection(collection: string): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/collections/files?collection=${encodeURIComponent(collection)}`
    );
    if (response.ok) {
      return await response.json();
    }
    return [];
  }

  async saveToCollection(collection: string, name: string, data: GraphData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/collections/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, name, data }),
    });
    if (!response.ok) throw new Error('Save to collection failed');
  }

  async loadFromCollection(collection: string, name: string): Promise<GraphData | null> {
    const response = await fetch(
      `${this.baseUrl}/collections/load?collection=${encodeURIComponent(collection)}&name=${encodeURIComponent(name)}`
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  }

  async deleteFromCollection(collection: string, name: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/collections/delete-file?collection=${encodeURIComponent(collection)}&name=${encodeURIComponent(name)}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Delete from collection failed');
  }

  async selectDirectory(): Promise<string | null> {
    return null;
  }

  getCollectionPath(name: string): string | null {
    return null;
  }

  async getDefaultFolder(): Promise<string> {
    // 服务器环境下返回空字符串
    return '';
  }
}
