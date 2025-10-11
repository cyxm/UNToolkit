const { ipcMain, dialog } = require("electron");
import { app } from 'electron'
import path from 'path';
import fs from 'fs';
import FileUtil from "../util/FileUtil";
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mainHandlers = [
    { name: "openFile", handle: handleFileOpen },

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

    { name: "fields:create", handle: handleCreateField },
    { name: "fields:query", handle: handleQueryFields },
    { name: "fields:update", handle: handleUpdateField },
    { name: "fields:delete", handle: handleDeleteField },
]

async function handleCreateField(
    event: Electron.IpcMainInvokeEvent,
    data: Prisma.fieldsCreateInput
) {
    try {
        const field = await prisma.fields.create({
            data: data
        });
        return { success: true, id: field.id };
    } catch (err) {
        console.error('Failed to create field:', err);
        return { success: false, error: "Failed to create field" };
    }
}

async function handleQueryFields(
    event: Electron.IpcMainInvokeEvent,
    params: Prisma.fieldsFindManyArgs
) {
    try {
        const fields = await prisma.fields.findMany(params);
        return {
            success: true,
            data: fields
        };
    } catch (err) {
        console.error('Failed to query fields:', err);
        return { success: false, error: "Failed to query fields" };
    }
}

async function handleUpdateField(data: Prisma.fieldsUpdateArgs) {
    try {
        const result = await prisma.fields.update({
            where: { id: data.where?.id },
            data: {
                name: data.data?.name,
                type: data.data?.type,
                primary: data.data?.primary,
                not_null: data.data?.not_null,
                default: data.data?.default,
                unique: data.data?.unique,
                enable: data.data?.enable
            }
        });
        return { success: true, changes: 1 };
    } catch (err) {
        console.error('Failed to update field:', err);
        return { success: false, error: "Failed to update field" };
    }
}

async function handleDeleteField(
    event: Electron.IpcMainInvokeEvent,
    id: number
) {
    try {
        const result = await prisma.fields.delete({
            where: { id }
        });
        return { success: true, changes: 1 };
    } catch (err) {
        console.error('Failed to delete field:', err);
        return { success: false, error: "Failed to delete field" };
    }
}

export function registerMainHandler() {
    mainHandlers.forEach(element => {
        ipcMain.handle(element.name, element.handle);
    });
}

async function handleFileOpen() {
    let path = app.getAppPath();
    dialog.showMessageBox({ type: 'info', message: path })
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
    data: Prisma.databasesCreateInput
) {
    try {
        const database = await prisma.databases.create({
            data: data
        });
        return { success: true, id: database.id };
    } catch (err) {
        console.error('Failed to create database:', err);
        return { success: false, error: "Failed to create database" };
    }
}

async function handleQueryDatabases(params: Prisma.databasesFindManyArgs = { where: { enable: 1 } }) {
    try {
        const databases = await prisma.databases.findMany({
            where: {
                id: params.where?.id,
                enable: params.where?.enable
            }
        });
        return { success: true, data: databases };
    } catch (err) {
        console.error('Failed to query databases:', err);
        return { success: false, error: "Failed to query databases" };
    }
}

async function handleUpdateDatabase(data: Prisma.databasesUpdateArgs) {
    try {
        const result = await prisma.databases.update({
            where: { id: data.where?.id },
            data: {
                version: data.data?.version,
                name: data.data?.name,
                enable: data.data?.enable
            }
        });
        return { success: true, changes: 1 };
    } catch (err) {
        console.error('Failed to update database:', err);
        return { success: false, error: "Failed to update database" };
    }
}

async function handleDeleteDatabase(event: Electron.IpcMainInvokeEvent, id: number) {
    try {
        const result = await prisma.databases.delete({
            where: { id }
        });
        return { success: true, changes: 1 };
    } catch (err) {
        console.error('Failed to delete database:', err);
        return { success: false, error: "Failed to delete database" };
    }
}

async function handleCreateTable(
    event: Electron.IpcMainInvokeEvent,
    data: Prisma.tablesCreateInput
) {
    try {
        const table = await prisma.tables.create({
            data: data
        });
        return { success: true, id: table.id };
    } catch (err) {
        console.error('Failed to create table:', err);
        return { success: false, error: "Failed to create table" };
    }
}

async function handleQueryTables(
    event: Electron.IpcMainInvokeEvent,
    params: Prisma.tablesFindManyArgs
) {
    try {
        const tables = await prisma.tables.findMany(params);
        return { success: true, data: tables };
    } catch (err) {
        console.error('Failed to query tables:', err);
        return { success: false, error: "Failed to query tables" };
    }
}

async function handleUpdateTable(data: Prisma.tablesUpdateArgs) {
    try {
        const result = await prisma.tables.update({
            where: { id: data.where?.id },
            data: {
                version: data.data?.version,
                name: data.data?.name,
                enable: data.data?.enable,
                database_id: data.data?.database_id
            }
        });
        return { success: true, changes: 1 };
    } catch (err) {
        console.error('Failed to update table:', err);
        return { success: false, error: "Failed to update table" };
    }
}

async function handleDeleteTable(
    event: Electron.IpcMainInvokeEvent,
    id: number
) {
    try {
        const result = await prisma.tables.delete({
            where: { id }
        });
        return { success: true, changes: 1 };
    } catch (err) {
        console.error('Failed to delete table:', err);
        return { success: false, error: "Failed to delete table" };
    }
}
