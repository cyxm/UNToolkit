import { contextBridge, ipcRenderer } from "electron"
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
    }
};

// 通过contextBridge安全暴露API'@app/protocol/src/preload'
contextBridge.exposeInMainWorld('electron', electronAPI);