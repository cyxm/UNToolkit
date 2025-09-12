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

    { name: "sql:start", handle: dbStart },
    { name: "sql:end", handle: dbEnd },

    { name: "api:getEndpoints", handle: handleGetApiEndpoints },
    { name: "api:call", handle: handleCallApi },

    { name: "databases:create", handle: handleCreateDatabase },
    { name: "databases:query", handle: handleQueryDatabases },
    { name: "databases:update", handle: handleUpdateDatabase },
    { name: "databases:delete", handle: handleDeleteDatabase },
    { name: "tables:create", handle: handleCreateTable },
    { name: "tables:query", handle: handleQueryTables },
    { name: "tables:update", handle: handleUpdateTable },
    { name: "tables:delete", handle: handleDeleteTable },
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

async function dbStart() {
    try {
        console.log('Database path:', dbPath);
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

async function handleCreateDatabase(
    event: Electron.IpcMainInvokeEvent,
    dbName: string,
    version?: number
) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }
        const now = Date.now();
        const stmt = db.prepare(
            `INSERT INTO databases (version, create_time, update_time, enable, name) 
             VALUES (?, ?, ?, ?, ?)`
        );
        const result = stmt.run(
            version ?? 1,
            now,
            now,
            1,
            dbName
        );
        return { success: true, id: result.lastInsertRowid };
    } catch (err) {
        console.error('Failed to create database:', err);
        return { success: false, error: "Failed to create database" };
    }
}

async function handleQueryDatabases(params: {
    id?: number;
    name?: string;
    enable?: number;
} = { enable: 1 }) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        const conditions = [];
        const values = [];

        if (params.id !== undefined) {
            conditions.push('id = ?');
            values.push(params.id);
        }
        if (params.name !== undefined) {
            conditions.push('name = ?');
            values.push(params.name);
        }
        if (params.enable !== undefined) {
            conditions.push('enable = ?');
            values.push(params.enable);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const sql = `SELECT * FROM databases ${where}`;

        const stmt = db.prepare(sql);
        const rows = stmt.all(...values);
        return { success: true, data: rows };
    } catch (err) {
        console.error('Failed to query databases:', err);
        return { success: false, error: "Failed to query databases" };
    }
}

async function handleUpdateDatabase(data: {
    id: number;
    version?: number;
    name?: string;
    enable?: number;
} & { enable?: 1 }) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        const updates = [];
        const values = [];

        if (data.version !== undefined) {
            updates.push('version = ?');
            values.push(data.version);
        }
        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.enable !== undefined) {
            updates.push('enable = ?');
            values.push(data.enable);
        }

        values.push(Date.now());
        values.push(data.id);
        const sql = `UPDATE databases SET ${updates.join(', ')}, update_time = ? WHERE id = ?`;

        const stmt = db.prepare(sql);
        const result = stmt.run(...values);
        return { success: true, changes: result.changes };
    } catch (err) {
        console.error('Failed to update database:', err);
        return { success: false, error: "Failed to update database" };
    }
}

async function handleCreateTable(
    event: Electron.IpcMainInvokeEvent,
    data: {
        name: string;
        database_id: number;
        version?: number;
        enable?: number;
    }) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }
        const now = Date.now();
        const stmt = db.prepare(
            `INSERT INTO tables (version, create_time, update_time, enable, name, database_id) 
             VALUES (?, ?, ?, ?, ?, ?)`
        );
        const result = stmt.run(
            data.version ?? 1,
            now,
            now,
            data.enable ?? 1,
            data.name,
            data.database_id
        );
        return { success: true, id: result.lastInsertRowid };
    } catch (err) {
        console.error('Failed to create table:', err);
        return { success: false, error: "Failed to create table" };
    }
}

async function handleQueryTables(params: {
    id?: number;
    name?: string;
    enable?: number;
    database_id?: number;
} = { enable: 1 }) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        const conditions = [];
        const values = [];

        if (params.id !== undefined) {
            conditions.push('id = ?');
            values.push(params.id);
        }
        if (params.name !== undefined) {
            conditions.push('name = ?');
            values.push(params.name);
        }
        if (params.enable !== undefined) {
            conditions.push('enable = ?');
            values.push(params.enable);
        }
        if (params.database_id !== undefined) {
            conditions.push('database_id = ?');
            values.push(params.database_id);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const sql = `SELECT * FROM tables ${where}`;

        const stmt = db.prepare(sql);
        const rows = stmt.all(...values);
        return { success: true, data: rows };
    } catch (err) {
        console.error('Failed to query tables:', err);
        return { success: false, error: "Failed to query tables" };
    }
}

async function handleUpdateTable(data: {
    id: number;
    version?: number;
    name?: string;
    enable?: number;
    database_id?: number;
}) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        const updates = [];
        const values = [];

        if (data.version !== undefined) {
            updates.push('version = ?');
            values.push(data.version);
        }
        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.enable !== undefined) {
            updates.push('enable = ?');
            values.push(data.enable);
        }
        if (data.database_id !== undefined) {
            updates.push('database_id = ?');
            values.push(data.database_id);
        }

        values.push(Date.now());
        values.push(data.id);
        const sql = `UPDATE tables SET ${updates.join(', ')}, update_time = ? WHERE id = ?`;

        const stmt = db.prepare(sql);
        const result = stmt.run(...values);
        return { success: true, changes: result.changes };
    } catch (err) {
        console.error('Failed to update table:', err);
        return { success: false, error: "Failed to update table" };
    }
}

async function handleDeleteTable(id: number) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }
        const stmt = db.prepare('DELETE FROM tables WHERE id = ?');
        const result = stmt.run(id);
        return { success: true, changes: result.changes };
    } catch (err) {
        console.error('Failed to delete table:', err);
        return { success: false, error: "Failed to delete table" };
    }
}

async function handleDeleteDatabase(id: number) {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        const stmt = db.prepare('DELETE FROM databases WHERE id = ?');
        const result = stmt.run(id);
        return { success: true, changes: result.changes };
    } catch (err) {
        console.error('Failed to delete database:', err);
        return { success: false, error: "Failed to delete database" };
    }
}