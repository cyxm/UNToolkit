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
    sql: {
        getDatabases: async () => await ipcRenderer.invoke('sql:getDatabases'),
        executeQuery: async (db: any, query: any) => await ipcRenderer.invoke('sql:execute', db, query)
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