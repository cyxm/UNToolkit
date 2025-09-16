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
             * @param data.version 版本号，默认为1
             * @param data.name 名称
             * @param data.enable 是否启用，默认为1
             * @returns 包含新记录ID的响应
             */
            create: (data: {
                version?: number;
                name: string;
                enable?: number;
            }) => Promise<{ success: true, id: number } | { success: false, error: string }>;

            /**
             * 查询数据库记录
             * @param params 查询参数
             * @param params.enable 是否启用，默认为1
             * @returns 包含查询结果的响应
             */
            query: (params?: {
                id?: number;
                name?: string;
                enable?: number;
            } & { enable?: 1 }) => Promise<{
                success: true, data: Array<{
                    id: number;
                    version: number;
                    create_time: number;
                    update_time: number;
                    enable: number;
                    name: string;
                }>
            } | { success: false, error: string }>;

            /**
             * 更新数据库记录
             * @param data 更新数据
             * @param data.enable 是否启用，默认为1
             * @returns 包含更新影响的记录数的响应
             */
            update: (data: {
                id: number;
                version?: number;
                name?: string;
                enable?: number;
            } & { enable?: 1 }) => Promise<{ success: true, changes: number } | { success: false, error: string }>;

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
             * @param data.version 版本号，默认为1
             * @param data.name 名称
             * @param data.enable 是否启用，默认为1
             * @param data.database_id 所属数据库ID
             * @returns 包含新记录ID的响应
             */
            create: (data: {
                version?: number;
                name: string;
                enable?: number;
                database_id: number;
            }) => Promise<{ success: true, id: number } | { success: false, error: string }>;

            /**
             * 查询表记录
             * @param params 查询参数
             * @param params.enable 是否启用，默认为1
             * @returns 包含查询结果的响应
             */
            query: (params?: {
                id?: number;
                name?: string;
                enable?: number;
                database_id?: number;
            } & { enable?: 1 }) => Promise<{
                success: true, data: Array<{
                    id: number;
                    version: number;
                    create_time: number;
                    update_time: number;
                    enable: number;
                    name: string;
                    database_id: number;
                }>
            } | { success: false, error: string }>;

            /**
             * 更新表记录
             * @param data 更新数据
             * @param data.enable 是否启用，默认为1
             * @returns 包含更新影响的记录数的响应
             */
            update: (data: {
                id: number;
                version?: number;
                name?: string;
                enable?: number;
                database_id?: number;
            } & { enable?: 1 }) => Promise<{ success: true, changes: number } | { success: false, error: string }>;

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
             * @param data.table_id 所属表ID
             * @param data.name 字段名称
             * @param data.type 字段类型
             * @param data.primary_key 是否主键，默认为0
             * @param data.foreign_key 是否外键，默认为0
             * @param data.not_null 是否非空，默认为0
             * @param data.default_value 默认值
             * @param data.unique 是否唯一，默认为0
             * @param data.enable 是否启用，默认为1
             * @returns 包含新记录ID的响应
             */
            create: (data: {
                table_id: number;
                name: string;
                type: string;
                primary_key?: number;
                foreign_key?: number;
                not_null?: number;
                default_value?: string;
                unique?: number;
                enable?: number;
            }) => Promise<{ success: true, id: number } | { success: false, error: string }>;

            /**
             * 查询字段记录
             * @param params 查询参数
             * @param params.table_id 所属表ID
             * @param params.enable 是否启用，默认为1
             * @returns 包含查询结果的响应
             */
            query: (params: {
                table_id: number;
                enable?: number;
            }) => Promise<{
                success: true,
                data: Array<{
                    id: number;
                    table_id: number;
                    name: string;
                    type: string;
                    primary_key: number;
                    foreign_key: number;
                    not_null: number;
                    default_value: string | null;
                    unique: number;
                    enable: number;
                }>
            } | { success: false, error: string }>;

            /**
             * 更新字段记录
             * @param data 更新数据
             * @param data.id 字段ID
             * @param data.name 字段名称
             * @param data.type 字段类型
             * @param data.primary_key 是否主键
             * @param data.foreign_key 是否外键
             * @param data.not_null 是否非空
             * @param data.default_value 默认值
             * @param data.unique 是否唯一
             * @param data.enable 是否启用
             * @returns 包含更新影响的记录数的响应
             */
            update: (data: {
                id: number;
                name?: string;
                type?: string;
                primary_key?: number;
                foreign_key?: number;
                not_null?: number;
                default_value?: string;
                unique?: number;
                enable?: number;
            }) => Promise<{ success: true, changes: number } | { success: false, error: string }>;

            /**
             * 删除字段记录
             * @param id 字段ID
             * @returns 包含删除影响的记录数的响应
             */
            delete: (id: number) => Promise<{ success: true, changes: number } | { success: false, error: string }>;
        };
    };

    api: {
        getApiEndpoints: () => void;
        callApi: (endpoint: any, params: any) => void;
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
