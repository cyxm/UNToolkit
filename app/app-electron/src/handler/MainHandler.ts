const { ipcMain, dialog } = require("electron");
import { app } from 'electron'
import FileUtil from "../util/FileUtil";
import Database from 'better-sqlite3';

// const dbPath = app.getPath('userData') + '/database.db';
// let db: Database.Database;

const mainHandlers = [
    { name: "openFile", handle: handleFileOpen },
    { name: "sql:getDatabases", handle: handleGetDatabases },
    { name: "sql:execute", handle: handleExecuteQuery },
    { name: "api:getEndpoints", handle: handleGetApiEndpoints },
    { name: "api:call", handle: handleCallApi },
    // { name: "window_close", handle: handleCloseWindow },
]

export function registerMainHandler() {
    // 初始化数据库连接
    // db = new Database(dbPath);
    // db.pragma('journal_mode = WAL');
    
    mainHandlers.forEach(element => {
        ipcMain.handle(element.name, element.handle);
    });
}

async function handleCloseWindow() {
    // 关闭数据库连接
    // if (db) {
    //     db.close();
    // }
}

async function handleFileOpen() {
    let path = app.getAppPath();
    dialog.showMessageBox({ type: 'info', message: path })
}

async function handleGetDatabases() {
}

async function handleExecuteQuery(dbName: string, query: string) {
}

async function handleGetApiEndpoints() {
    // 这里应该是实际的API端点获取逻辑
    // 暂时返回模拟数据
    return [
        { id: 'users', name: '用户API' },
        { id: 'products', name: '产品API' },
        { id: 'orders', name: '订单API' }
    ];
}

async function handleCallApi(endpoint: string, params: string) {
    // 这里应该是实际的API调用逻辑
    // 暂时返回模拟结果
    return {
        success: true,
        endpoint,
        params: JSON.parse(params),
        data: `Called ${endpoint} API with params: ${params}`
    };
}