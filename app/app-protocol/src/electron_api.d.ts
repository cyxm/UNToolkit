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

    sql: {
        getDatabases: () => void;
        executeQuery: (db: any, query: any) => void;
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
