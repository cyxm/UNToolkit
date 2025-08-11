import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

import { registerMainHandler } from './handler/MainHandler'
import { ipcMain } from 'electron'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
    let preferencePath = path.join(__dirname, '../res/config/preference.json');
    let preference = fs.readFileSync(preferencePath);
    let preferenceObj = JSON.parse(preference.toString());
    let customWindowTitleConfig = {
        // 隐藏标题栏和菜单栏
        frame: false,
        // 隐藏菜单栏
        autoHideMenuBar: true,
        // 可否最小化
        minimizable: true,
        // 可否最大化
        maximizable: true,
        // 展示关闭按钮
        closable: false,
        // 全屏
        fullscreen: false,
        // 在任务栏显示图标
        skipTaskbar: false,
        // 是否允许单击激活窗口
        acceptFirstMouse: true,
        // 透明度
        transparent: false,
        // 窗口是否可移动
        movable: true,
        // 只在macos下生效
        // 全屏
        simpleFullscreen: true
    }
    mainWindow = new BrowserWindow({
        width: preferenceObj.initPosition.width,
        height: preferenceObj.initPosition.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        },
        ...customWindowTitleConfig
    })
    // win.loadFile('index.html')
    mainWindow.loadURL('http://localhost:3000')
    // 开发工具
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools()
    }
}

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

app.on(
    'window-all-closed',
    () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }
)

ipcMain.on('window_min', function () {
    mainWindow?.minimize();
})

ipcMain.on('window_max', function () {
    if (mainWindow?.isMaximized()) {
        mainWindow?.unmaximize();
    } else {
        mainWindow?.maximize();
    }
})

ipcMain.on('window_close', function () {
    mainWindow?.close();
})