import { ipcMain, dialog, app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';

let graphDataPath: string | null = null;

function getGraphDataPath(): string {
    if (!graphDataPath) {
        const userDataPath = app.getPath('userData');
        graphDataPath = path.join(userDataPath, 'graph-data');
        if (!fs.existsSync(graphDataPath)) {
            fs.mkdirSync(graphDataPath, { recursive: true });
        }
    }
    return graphDataPath;
}

async function handleFileRead(event: Electron.IpcMainInvokeEvent, name: string): Promise<string | null> {
    try {
        const dataPath = getGraphDataPath();
        const filePath = path.join(dataPath, `${name}.json`);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf-8');
        }
        return null;
    } catch (err) {
        console.error('Failed to read file:', err);
        return null;
    }
}

async function handleFileWrite(event: Electron.IpcMainInvokeEvent, name: string, content: string): Promise<boolean> {
    try {
        const dataPath = getGraphDataPath();
        const filePath = path.join(dataPath, `${name}.json`);
        fs.writeFileSync(filePath, content, 'utf-8');
        return true;
    } catch (err) {
        console.error('Failed to write file:', err);
        return false;
    }
}

async function handleFileList(): Promise<string[]> {
    try {
        const dataPath = getGraphDataPath();
        if (!fs.existsSync(dataPath)) {
            return [];
        }
        const files = fs.readdirSync(dataPath);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
    } catch (err) {
        console.error('Failed to list files:', err);
        return [];
    }
}

async function handleFileDelete(event: Electron.IpcMainInvokeEvent, name: string): Promise<boolean> {
    try {
        const dataPath = getGraphDataPath();
        const filePath = path.join(dataPath, `${name}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return true;
    } catch (err) {
        console.error('Failed to delete file:', err);
        return false;
    }
}

async function handleFileImport(): Promise<{ name: string; content: string } | null> {
    try {
        const result = await dialog.showOpenDialog({
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
            properties: ['openFile']
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        const filePath = result.filePaths[0];
        const content = fs.readFileSync(filePath, 'utf-8');
        const name = path.basename(filePath, '.json');

        return { name, content };
    } catch (err) {
        console.error('Failed to import file:', err);
        return null;
    }
}

async function handleFileSaveAs(event: Electron.IpcMainInvokeEvent, defaultName: string, content: string, defaultPath?: string): Promise<string | null> {
    try {
        const dialogOptions: Electron.SaveDialogOptions = {
            defaultPath: defaultName.endsWith('.json') ? defaultName : `${defaultName}.json`,
            filters: [{ name: 'JSON Files', extensions: ['json'] }]
        };
        
        if (defaultPath) {
            dialogOptions.defaultPath = require('path').join(defaultPath, dialogOptions.defaultPath);
        }
        
        const result = await dialog.showSaveDialog(dialogOptions);

        if (result.canceled || !result.filePath) {
            return null;
        }

        fs.writeFileSync(result.filePath, content, 'utf-8');
        return path.basename(result.filePath, '.json');
    } catch (err) {
        console.error('Failed to save file:', err);
        return null;
    }
}

async function handleFileSelectDirectory(): Promise<string | null> {
    try {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        return result.filePaths[0];
    } catch (err) {
        console.error('Failed to select directory:', err);
        return null;
    }
}

async function handleFileCreateCollection(event: Electron.IpcMainInvokeEvent, name: string, path?: string): Promise<boolean> {
    try {
        if (path) {
            const fs = require('fs');
            const folderPath = require('path').join(path, name);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
        }
        return true;
    } catch (err) {
        console.error('Failed to create collection:', err);
        return false;
    }
}

async function handleFileDeleteCollection(event: Electron.IpcMainInvokeEvent, name: string, path?: string): Promise<boolean> {
    try {
        if (path) {
            const fs = require('fs');
            const folderPath = require('path').join(path, name);
            if (fs.existsSync(folderPath)) {
                fs.rmSync(folderPath, { recursive: true, force: true });
            }
        }
        return true;
    } catch (err) {
        console.error('Failed to delete collection:', err);
        return false;
    }
}

async function handleFileListFilesInCollection(event: Electron.IpcMainInvokeEvent, collection: string, path?: string): Promise<string[]> {
    try {
        if (path) {
            const fs = require('fs');
            const folderPath = require('path').join(path, collection);
            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath);
                return files
                    .filter((file: string) => file.endsWith('.json'))
                    .map((file: string) => file.replace('.json', ''));
            }
        }
        return [];
    } catch (err) {
        console.error('Failed to list files in collection:', err);
        return [];
    }
}

async function handleFileSaveToCollection(event: Electron.IpcMainInvokeEvent, collection: string, name: string, content: string, path?: string): Promise<boolean> {
    try {
        if (path) {
            const fs = require('fs');
            const folderPath = require('path').join(path, collection);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            const filePath = require('path').join(folderPath, `${name}.json`);
            fs.writeFileSync(filePath, content, 'utf-8');
        }
        return true;
    } catch (err) {
        console.error('Failed to save to collection:', err);
        return false;
    }
}

async function handleFileLoadFromCollection(event: Electron.IpcMainInvokeEvent, collection: string, name: string, path?: string): Promise<string | null> {
    try {
        if (path) {
            const fs = require('fs');
            const filePath = require('path').join(path, collection, `${name}.json`);
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf-8');
            }
        }
        return null;
    } catch (err) {
        console.error('Failed to load from collection:', err);
        return null;
    }
}

async function handleFileDeleteFromCollection(event: Electron.IpcMainInvokeEvent, collection: string, name: string, path?: string): Promise<boolean> {
    try {
        if (path) {
            const fs = require('fs');
            const filePath = require('path').join(path, collection, `${name}.json`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return true;
    } catch (err) {
        console.error('Failed to delete from collection:', err);
        return false;
    }
}

async function handleFileGetDefaultFolder(): Promise<string | null> {
    try {
        // 返回用户的文档目录作为默认文件夹
        return app.getPath('documents');
    } catch (err) {
        console.error('Failed to get default folder:', err);
        return null;
    }
}

export function registerMainHandler() {
    ipcMain.handle('file:read', handleFileRead);
    ipcMain.handle('file:write', handleFileWrite);
    ipcMain.handle('file:list', handleFileList);
    ipcMain.handle('file:delete', handleFileDelete);
    ipcMain.handle('file:import', handleFileImport);
    ipcMain.handle('file:saveAs', handleFileSaveAs);
    ipcMain.handle('file:selectDirectory', handleFileSelectDirectory);
    ipcMain.handle('file:createCollection', handleFileCreateCollection);
    ipcMain.handle('file:deleteCollection', handleFileDeleteCollection);
    ipcMain.handle('file:listFilesInCollection', handleFileListFilesInCollection);
    ipcMain.handle('file:saveToCollection', handleFileSaveToCollection);
    ipcMain.handle('file:loadFromCollection', handleFileLoadFromCollection);
    ipcMain.handle('file:deleteFromCollection', handleFileDeleteFromCollection);
    ipcMain.handle('file:getDefaultFolder', handleFileGetDefaultFolder);
}
