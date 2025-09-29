import { Prisma } from '@prisma/client';

// 定义主进程与渲染进程通信的API接口
export interface ElectronAPI {
    // 文件操作接口
    file: {
        readFile: (path: string) => Promise<string>;
        writeFile: (path: string, content: string) => Promise<boolean>;
    };

    // 系统信息接口
    system: {
        getOS: () => Promise<string>;
        showMessageBox: (message: string) => Promise<void>;
    };

    db: {
        start: () => Promise<boolean>;
        end: () => Promise<boolean>;

        // 数据库表操作
        databases: {
            /**
             * 创建数据库记录
             * @param data 数据库记录数据
             * @returns 包含新记录ID的响应
             */
            create: (data: Prisma.databasesCreateInput) => Promise<{ success: true, id: number } | { success: false, error: string }>;

            /**
             * 查询数据库记录
             * @param params 查询参数
             * @returns 包含查询结果的响应
             */
            query: (params?: Prisma.databasesFindManyArgs) => Promise<{
                success: true,
                data: Array<Prisma.databasesGetPayload<Prisma.databasesDefaultArgs>>
            } | { success: false, error: string }>;

            /**
             * 更新数据库记录
             * @param data 更新数据
             * @returns 包含更新影响的记录数的响应
             */
            update: (data: Prisma.databasesUpdateArgs) => Promise<{ success: true, changes: number } | { success: false, error: string }>;

            /**
             * 删除数据库记录
             * @param id 记录ID
             * @returns 包含删除影响的记录数的响应
             */
            delete: (id: number) => Promise<{ success: true, changes: number } | { success: false, error: string }>;
        };

        // 数据库表操作
        tables: {
            /**
             * 创建表记录
             * @param data 表记录数据
             * @returns 包含新记录ID的响应
             */
            create: (data: Prisma.tablesCreateInput) => Promise<{ success: true, id: number } | { success: false, error: string }>;

            /**
             * 查询表记录
             * @param params 查询参数
             * @returns 包含查询结果的响应
             */
            query: (params?: Prisma.tablesFindManyArgs) => Promise<{
                success: true,
                data: Array<Prisma.tablesGetPayload<Prisma.tablesDefaultArgs>>
            } | { success: false, error: string }>;

            /**
             * 更新表记录
             * @param data 更新数据
             * @returns 包含更新影响的记录数的响应
             */
            update: (data: Prisma.tablesUpdateArgs) => Promise<{ success: true, changes: number } | { success: false, error: string }>;

            /**
             * 删除表记录
             * @param id 记录ID
             * @returns 包含删除影响的记录数的响应
             */
            delete: (id: number) => Promise<{ success: true, changes: number } | { success: false, error: string }>;
        };

        // 字段操作
        fields: {
            /**
             * 创建字段记录
             * @param data 字段记录数据
             * @returns 包含新记录ID的响应
             */
            create: (data: Prisma.fieldsCreateInput) => Promise<{ success: true, id: number } | { success: false, error: string }>;

            /**
             * 查询字段记录
             * @param params 查询参数
             * @returns 包含查询结果的响应
             */
            query: (params: Prisma.fieldsFindManyArgs) => Promise<{
                success: true,
                data: Array<Prisma.fieldsGetPayload<Prisma.fieldsDefaultArgs>>
            } | { success: false, error: string }>;

            /**
             * 更新字段记录
             * @param data 更新数据
             * @returns 包含更新影响的记录数的响应
             */
            update: (data: Prisma.fieldsUpdateArgs) => Promise<{ success: true, changes: number } | { success: false, error: string }>;

            /**
             * 删除字段记录
             * @param id 字段ID
             * @returns 包含删除影响的记录数的响应
             */
            delete: (id: number) => Promise<{ success: true, changes: number } | { success: false, error: string }>;
        };
    };

    func: {
    };

    window: {
        min: () => void;
        max: () => void;
        close: () => void;
    }
}

// 声明全局变量，让渲染进程可以识别
declare global {
    interface Window {
        electron: ElectronAPI;
    }
}
