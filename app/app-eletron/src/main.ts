import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

import { registerMainHandler } from './handler/MainHandler'

const createWindow = () => {
    let preferencePath = path.join(__dirname, '../res/config/preference.json');
    let preference = fs.readFileSync(preferencePath);
    let preferenceObj = JSON.parse(preference.toString());
    const win = new BrowserWindow({
        width: preferenceObj.initPosition.width,
        height: preferenceObj.initPosition.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        }
    })
    // win.loadFile('index.html')
    win.loadURL('http://localhost:3000')
    // 开发工具
    // win.webContents.openDevTools()
}

app.on(
    'window-all-closed',
    () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }
)

app.whenReady().then(
    () => {
        registerMainHandler()

        createWindow()
        app.on(
            'activate',
            () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    createWindow()
                }
            }
        )
    }
)