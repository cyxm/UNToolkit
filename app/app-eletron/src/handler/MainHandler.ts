const { ipcMain, dialog } = require("electron");

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
    FileUtil.readFile()
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
        return filePaths[0]
    }
}