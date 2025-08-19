import { contextBridge, ipcRenderer } from "electron"

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
})