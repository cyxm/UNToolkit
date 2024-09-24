const { ipcMain, dialog } = require("electron");

const mainHandlers = [
    { name: "openFile", handle: handleFileOpen }
]

export function registerMainHandler() {
    mainHandlers.forEach(element => {
        ipcMain.handle(element.name, element.handle);
    });
}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
        return filePaths[0]
    }
}