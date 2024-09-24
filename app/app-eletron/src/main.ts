import { app, BrowserWindow } from 'electron'
import path from 'node:path'

import { registerMainHandler } from './handler/MainHandler'
// const rr = require('../src/handler/MainHandler.ts')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
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