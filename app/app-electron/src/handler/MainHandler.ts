const { ipcMain, dialog } = require("electron");
import { app } from 'electron'
import path from 'path';
import fs from 'fs';
import FileUtil from "../util/FileUtil";
import Database from 'better-sqlite3';

const dbPath = path.join(app.getAppPath(), 'db', 'db_manager.db');
let db: Database.Database;

// 检查数据库文件是否存在
if (!fs.existsSync(dbPath)) {
  console.error(`Database file not found at: ${dbPath}`);
  throw new Error(`Database file not found at: ${dbPath}`);
}

const mainHandlers = [
    { name: "openFile", handle: handleFileOpen },

    { name: "sql:execute", handle: handleExecuteQuery },
    { name: "sql:start", handle: dbStart },
    { name: "sql:end", handle: dbEnd },

    { name: "api:getEndpoints", handle: handleGetApiEndpoints },
    { name: "api:call", handle: handleCallApi },
]

export function registerMainHandler() {
    mainHandlers.forEach(element => {
        ipcMain.handle(element.name, element.handle);
    });
}

async function handleFileOpen() {
    let path = app.getAppPath();
    dialog.showMessageBox({ type: 'info', message: path })
}

async function handleExecuteQuery(query: string) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        // 检查查询类型
        const queryType = query.trim().split(/\s+/)[0].toUpperCase();

        switch (queryType) {
            case 'SELECT':
                const stmt = db.prepare(query);
                const rows = stmt.all();
                return { success: true, data: rows };
            case 'INSERT':
            case 'UPDATE':
            case 'DELETE':
                const result = db.prepare(query).run();
                return { success: true, data: result };
            default:
                throw new Error('Unsupported SQL statement');
        }
    } catch (err) {
        console.error('Failed to execute query:', err);
        return { success: false, error: "Failed to execute query" };
    }
}

async function dbStart() {
    try {
        db = new Database(dbPath);
        console.log('Database connected successfully');
        return true;
    } catch (err) {
        console.error('Failed to connect to database:', err);
        return false;
    }
}

async function dbEnd() {
    try {
        if (db) {
            db.close();
            console.log('Database connection closed');
        }
        return true;
    } catch (err) {
        console.error('Failed to close database connection:', err);
        return false;
    }
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