# moltbot-kook

Kook 聊天平台的 Clawdbot 通道插件。

## 安装

### 方式一：从 npm 安装

```bash
npm install @kookapp/moltbot-kook
```

然后作为明文插件加载到 Clawdbot 项目中（无需构建）。

### 方式二：本地开发模式

```bash
# 克隆仓库
git clone https://github.com/clawdbot/kook.git
cd kook

# 安装依赖
npm install

# 作为明文插件加载（无需构建）
# 在你的 Clawdbot 项目中引用此目录
```

## 配置

### 使用配置向导（推荐）

运行 Clawdbot 配置向导：

```bash
clawdbot setup
```

选择 Kook 通道并按照提示输入：
- **Bot Token**: 从 [Kook 开发者平台](https://developer.kookapp.cn/bot/) 获取
- **DM 策略**: 选择私聊消息处理策略
- **群组策略**: 选择群组/频道消息处理策略

### 手动配置

在 Clawdbot 配置文件中添加：

```json
{
  "channels": {
    "kook": {
      "enabled": true,
      "token": "你的机器人Token",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["频道ID1", "频道ID2"],
      "requireMention": true
    }
  }
}
```

### 使用环境变量

```bash
export KOOK_BOT_TOKEN="你的机器人Token"
clawdbot gateway start
```

**获取 Bot Token**: https://developer.kookapp.cn/bot/

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

此插件以明文方式运行，无需构建步骤：

```bash
# 安装依赖
npm install

# 直接在你的 Clawdbot 项目中引用此插件目录
# 修改代码后重启 Clawdbot 即可
clawdbot gateway restart
```

## 发布到 npm

```bash
# 更新 package.json 中的版本号
# 登录 npm
npm login

# 发布（作为明文插件包，无需构建）
npm publish

# 或发布测试版本
npm publish --tag beta
```

## 目录结构

```
moltbot-kook/
├── src/
│   ├── channel.ts        # 核心通道实现（消息处理、WebSocket）
│   ├── runtime.ts        # 运行时管理
│   ├── config-schema.ts  # 配置 Schema（Zod）
│   ├── onboarding.ts     # 配置向导
│   ├── probe.ts          # 连接测试
│   ├── types.ts          # TypeScript 类型定义
│   └── plugin-sdk.d.ts   # 插件 SDK 类型
├── index.ts              # 插件入口（导出）
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## 功能特性

- ✅ WebSocket 实时连接
- ✅ 私聊和频道消息支持
- ✅ 配置向导（交互式设置）
- ✅ 环境变量支持
- ✅ 消息分块（自动处理长消息）
- ✅ DM 策略配置（open/pairing/allowlist）
- ✅ 群组策略配置（open/allowlist/disabled）
- ✅ 连接状态监控
- ✅ 自动重连机制

## License

MIT
