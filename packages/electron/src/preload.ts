import { contextBridge, ipcMain, ipcRenderer } from "electron"
import type { ElectronAPI } from "@un/tool-shared/electron_api"

// 实现API接口
const electronAPI: ElectronAPI = {
    file: {
        readFile: async (name) => await ipcRenderer.invoke('file:read', name),
        writeFile: async (name, content) => await ipcRenderer.invoke('file:write', name, content),
        saveAs: async (name, content, path) => await ipcRenderer.invoke('file:saveAs', name, content, path),
        list: async () => await ipcRenderer.invoke('file:list'),
        delete: async (name) => await ipcRenderer.invoke('file:delete', name),
        import: async () => await ipcRenderer.invoke('file:import'),
        selectDirectory: async () => await ipcRenderer.invoke('file:selectDirectory'),
        createCollection: async (name, path) => await ipcRenderer.invoke('file:createCollection', name, path),
        deleteCollection: async (name, path) => await ipcRenderer.invoke('file:deleteCollection', name, path),
        listFilesInCollection: async (collection, path) => await ipcRenderer.invoke('file:listFilesInCollection', collection, path),
        saveToCollection: async (collection, name, content, path) => await ipcRenderer.invoke('file:saveToCollection', collection, name, content, path),
        loadFromCollection: async (collection, name, path) => await ipcRenderer.invoke('file:loadFromCollection', collection, name, path),
        deleteFromCollection: async (collection, name, path) => await ipcRenderer.invoke('file:deleteFromCollection', collection, name, path),
        getDefaultFolder: async () => await ipcRenderer.invoke('file:getDefaultFolder')
    },
    system: {
        getOS: async () => await ipcRenderer.invoke('system:os'),
        showMessageBox: async (message) => await ipcRenderer.invoke('system:message', message)
    },
    db: {
        start: async () => await ipcRenderer.invoke('sql:start'),
        end: async () => await ipcRenderer.invoke('sql:end'),
        databases: {
            create: async (data: any) => await ipcRenderer.invoke('databases:create', data),
            query: async (params?: any) => await ipcRenderer.invoke('databases:query', params),
            update: async (data: any) => await ipcRenderer.invoke('databases:update', data),
            delete: async (id: number) => await ipcRenderer.invoke('databases:delete', id)
        },
        tables: {
            create: async (data: any) => await ipcRenderer.invoke('tables:create', data),
            query: async (params?: any) => await ipcRenderer.invoke('tables:query', params),
            update: async (data: any) => await ipcRenderer.invoke('tables:update', data),
            delete: async (id: number) => await ipcRenderer.invoke('tables:delete', id)
        },
        fields: {
            create: async (data:any) => await ipcRenderer.invoke('fields:create', data),
            query: async (params: any) => await ipcRenderer.invoke('fields:query', params),
            update: async (data: any) => await ipcRenderer.invoke('fields:update', data),
            delete: async (id: number) => await ipcRenderer.invoke('fields:delete', id)
        }
    },
    func: {
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