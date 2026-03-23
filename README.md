# UNToolkit

一个基于Electron的软件集成工具，用于管理和调用系统中的各种软件。

## 第一章 环境部署

### 1. 安装 NVM (Node Version Manager)

NVM 是一个管理多个 Node.js 版本的工具，推荐使用它来安装和管理 Node.js。

#### macOS/Linux

```bash
# 使用 curl 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 或者使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 安装完成后，重新打开终端或执行以下命令
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 验证 NVM 安装成功
nvm --version
```

#### Windows

1. 下载 NVM for Windows 安装包：[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. 运行安装程序，按照提示完成安装
3. 打开新的命令提示符或 PowerShell
4. 验证 NVM 安装成功：

```bash
nvm version
```

### 2. 安装 Node.js

使用 NVM 安装 Node.js LTS 版本：

```bash
# 安装 Node.js LTS 版本
nvm install --lts

# 设置默认版本
nvm use --lts
nvm alias default lts/*

# 验证 Node.js 安装成功
node -v
npm -v
```

### 3. 安装 pnpm

pnpm 是一个快速、节省磁盘空间的包管理器，推荐使用它来管理项目依赖。

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证 pnpm 安装成功
pnpm --version
```

### 4. 配置 pnpm 存储目录（可选）

如果遇到权限问题，可以配置 pnpm 的存储目录：

```bash
# 1. 设置全局包安装目录
pnpm config set global-dir ~/.pnpm/global
# 2. 设置全局 bin 目录（关键：全局命令存放路径）
pnpm config set global-bin-dir ~/.pnpm/bin
# 3. 设置 pnpm 缓存目录
pnpm config set store-dir ~/.pnpm/store
# 4. 验证配置是否生效
pnpm config list --global
```


