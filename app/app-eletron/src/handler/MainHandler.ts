const { ipcMain, dialog } = require("electron");
import { app } from 'electron'
import FileUtil from "../util/FileUtil";

const mainHandlers = [
    { name: "openFile", handle: handleFileOpen }
]

export function registerMainHandler() {
    mainHandlers.forEach(element => {
        ipcMain.handle(element.name, element.handle);
    });
}

async function handleFileOpen() {
    // let pathArray: ('documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps' | 'userData' | 'appData' | 'temp' | 'exe' | 'module' | 'desktop' | 'home' | 'sessionData')[] = [
    //     'home',
    //     'appData',
    //     'userData',
    //     'sessionData',
    //     'temp',
    //     'exe',
    //     'module',
    //     'desktop',
    //     'documents',
    //     'downloads',
    //     'music',
    //     'pictures',
    //     'videos',
    //     'recent',
    //     'logs',
    //     'crashDumps'
    // ]
    // pathArray.forEach(e => {
    //     console.log(app.getPath(e));
    // })
    let path = app.getAppPath();
    dialog.showMessageBox({ type: 'info', message: path })
    // FileUtil.readFile()
    // const { canceled, filePaths } = await dialog.showOpenDialog({})
    // if (!canceled) {
    //     return filePaths[0]
    // }
}