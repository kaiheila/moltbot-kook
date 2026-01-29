# moltbot-kook

Kook 聊天平台的 Clawdbot 通道插件。

## 安装

### 方式一：从 npm 安装

```bash
npm install moltbot-kook
```

然后复制到 Clawdbot 扩展目录：

```bash
# 全局安装
mkdir -p ~/.clawdbot/extensions/kook
cp -r node_modules/moltbot-kook/* ~/.clawdbot/extensions/kook/

# 或在工作区安装
mkdir -p /path/to/your/workspace/.clawdbot/extensions/kook
cp -r node_modules/moltbot-kook/* /path/to/your/workspace/.clawdbot/extensions/kook/
```

### 方式二：克隆并链接（开发模式）

```bash
# 克隆仓库
git clone https://github.com/clawdbot/kook.git
cd kook

# 安装依赖
npm install

# 构建
npm run build

# 链接到 Clawdbot
mkdir -p ~/.clawdbot/extensions/kook
cp -r dist/* ~/.clawdbot/extensions/kook/
```

## 配置

在 Clawdbot 配置文件 (`~/.clawdbot/clawdbot.json`) 中添加：

```json
{
  "channels": {
    "kook": {
      "enabled": true,
      "token": "你的机器人Token"
    }
  }
}
```

机器人 Token 获取：https://developer.kookapp.cn/bot/

## 重启 Clawdbot

安装和配置完成后：

```bash
clawdbot gateway restart
```

## 使用

配置完成后，Clawdbot 将自动：
- 通过 WebSocket 连接到 Kook
- 监听频道和私聊消息
- 将回复发送回 Kook

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 监听模式
npm run dev

# 构建后复制到 Clawdbot 测试
cp -r dist/* ~/.clawdbot/extensions/kook/
clawdbot gateway restart
```

## 发布到 npm

```bash
# 更新 package.json 中的版本号
# 登录 npm
npm login

# 发布
npm publish

# 或发布测试版本
npm publish --tag beta
```

## 目录结构

```
moltbot-kook/
├── src/
│   ├── index.ts          # 插件入口
│   ├── channel.ts        # 核心通道实现
│   ├── runtime.ts        # 运行时工具
│   └── plugin-sdk.d.ts   # 类型声明
├── dist/                 # 构建输出
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## License

MIT
