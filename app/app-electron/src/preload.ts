import { contextBridge, ipcRenderer } from "electron"

// 事件桥接API
contextBridge.exposeInMainWorld('eventBridge', {
    on: (event: string, listener: (...args: any[]) => void) => {
        ipcRenderer.on(event, (_, ...args) => listener(...args));
    },
    once: (event: string, listener: (...args: any[]) => void) => {
        ipcRenderer.once(event, (_, ...args) => listener(...args));
    },
    emit: (event: string, ...args: any[]) => {
        ipcRenderer.send(event, ...args);
    },
    invoke: <T = any>(channel: string, ...args: any[]): Promise<T> => {
        return ipcRenderer.invoke(channel, ...args);
    },
    removeListener: (event: string, listener: (...args: any[]) => void) => {
        ipcRenderer.removeListener(event, listener);
    }
});

// 其他工具API
contextBridge.exposeInMainWorld('eApi', {
    getNodeVersion: () => process.versions.node,
    getChromeVersion: () => process.versions.chrome,
    getElectronVersion: () => process.versions.electron,
    getPlatform: () => process.platform,
    getArch: () => process.arch,
    getAppPath: () => process.execPath,
    getAppArgs: () => process.argv,
    getEnv: () => process.env,
    openFile: () => ipcRenderer.invoke('openFile')
});