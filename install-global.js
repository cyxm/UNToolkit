#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

// 定义要安装的全局模块列表
const packages = [
    //包管理器
    'pnpm',
    //构建系统
    "turbo",
    //启动时等待依赖服务
    "wait-on",
    //版本管理工具
    "npm-check-updates",
    "node-gyp",
    "@electron/rebuild"
];

// 检查是否有足够的权限
function checkPermissions() {
    try {
        // 尝试执行一个需要权限的简单操作来测试
        execSync('npm whoami -g', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

// 安装单个包
function installPackage(pkg) {
    try {
        console.log(`开始安装: ${pkg}`);
        // 执行安装命令，显示输出
        execSync(`npm install -g ${pkg}`, { stdio: 'inherit' });
        console.log(`成功安装: ${pkg}\n`);
        return true;
    } catch (error) {
        console.error(`安装 ${pkg} 失败`);
        return false;
    }
}

// 主函数
function main() {
    console.log(`检测到操作系统: ${os.type()} ${os.release()}`);

    // 检查权限
    const hasPermission = checkPermissions();
    if (!hasPermission) {
        console.warn('\n注意：可能没有足够的权限安装全局模块。');
        console.warn('如果安装失败，请尝试使用管理员权限运行或配置npm全局目录。\n');
    }

    console.log(`\n预备安装 ${packages.length} 个全局模块...\n`);

    const startTime = Date.now();
    const failedPackages = [];

    // 逐个安装包
    packages.forEach(pkg => {
        if (!installPackage(pkg)) {
            failedPackages.push(pkg);
        }
    });

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('\n===== 安装结果 =====');
    console.log(`总耗时: ${duration} 秒`);
    console.log(`成功安装: ${packages.length - failedPackages.length} 个`);

    if (failedPackages.length > 0) {
        console.log(`安装失败: ${failedPackages.length} 个`);
        console.log('失败的包:', failedPackages.join(', '));
        console.log('请尝试手动安装失败的包');
    } else {
        console.log('所有包都已成功安装！');
    }
}

// 运行主函数
main();