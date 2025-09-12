import { contextBridge, ipcMain, ipcRenderer } from "electron"
import type { ElectronAPI } from "@un/tool-protocol/electron_api"

// 实现API接口
const electronAPI: ElectronAPI = {
    file: {
        readFile: async (path) => await ipcRenderer.invoke('file:read', path),
        writeFile: async (path, content) => await ipcRenderer.invoke('file:write', path, content)
    },
    system: {
        getOS: async () => await ipcRenderer.invoke('system:os'),
        showMessageBox: async (message) => await ipcRenderer.invoke('system:message', message)
    },
    db: {
        start: async () => await ipcRenderer.invoke('sql:start'),
        end: async () => await ipcRenderer.invoke('sql:end'),
        databases: {
            create: async (data: { version?: number; name: string; enable?: number }) =>
                await ipcRenderer.invoke('databases:create', data),
            query: async (params?: { id?: number; name?: string; enable?: number } & { enable?: 1 }) =>
                await ipcRenderer.invoke('databases:query', params),
            update: async (data: { id: number; version?: number; name?: string; enable?: number } & { enable?: 1 }) =>
                await ipcRenderer.invoke('databases:update', data),
            delete: async (id: number) =>
                await ipcRenderer.invoke('databases:delete', id)
        },
        tables: {
            create: async (data: {
                version?: number;
                name: string;
                enable?: number;
                database_id: number;
            }) => await ipcRenderer.invoke('tables:create', data),
            query: async (params?: {
                id?: number;
                name?: string;
                enable?: number;
                database_id?: number;
            } & { enable?: 1 }) => await ipcRenderer.invoke('tables:query', params),
            update: async (data: {
                id: number;
                version?: number;
                name?: string;
                enable?: number;
                database_id?: number;
            } & { enable?: 1 }) => await ipcRenderer.invoke('tables:update', data),
            delete: async (id: number) => await ipcRenderer.invoke('tables:delete', id)
        }
    },
    api: {
        getApiEndpoints: async () => await ipcRenderer.invoke('api:getEndpoints'),
        callApi: async (endpoint: any, params: any) => await ipcRenderer.invoke('api:call', endpoint, params)
    },
    window: {
        min: function (): void {
            ipcRenderer.invoke('window_min')
                .catch(err => console.error('Failed to min window:', err));
        },
        max: function (): void {
            ipcRenderer.invoke('window_max')
                .catch(err => console.error('Failed to max window:', err));
        },
        close: async () => {
            ipcRenderer.invoke('window_close')
                .catch(err => console.error('Failed to close window:', err));
        },
    }
};

// 通过contextBridge安全暴露API'@app/protocol/src/preload'
contextBridge.exposeInMainWorld('electron', electronAPI);