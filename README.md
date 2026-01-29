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
      "allowedUserId": "1234567890",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["频道ID1", "频道ID2"],
      "requireMention": true
    }
  }
}
```

**重要安全配置**：
- `allowedUserId`: **强烈推荐设置**，指定唯一允许控制此机器人的用户 ID。只有该用户的消息会被处理，其他用户的消息会被忽略。适用于远程控制场景。

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
- ✅ **用户白名单**（allowedUserId）- 仅允许指定用户控制
- ✅ 连接状态监控
- ✅ 自动重连机制

## 配置项详解

### 所有可配置的用户输入配置项

| 配置项 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `enabled` | boolean | 否 | `true` | 是否启用 Kook 通道 |
| `token` | string | **是** | - | Kook Bot Token（或使用环境变量 `KOOK_BOT_TOKEN`） |
| `name` | string | 否 | - | 账户名称（用于标识） |
| `allowedUserId` | string | **强烈推荐** | - | **安全配置**：只允许此用户 ID 的消息被处理，其他用户消息会被忽略 |
| `dmPolicy` | string | 否 | `"pairing"` | 私聊消息策略：<br/>• `"open"` - 开放（需配合 allowFrom: ["*"]）<br/>• `"pairing"` - 配对模式<br/>• `"allowlist"` - 白名单模式 |
| `allowFrom` | string[] | 否 | `[]` | 私聊白名单（用户 ID 列表），配合 dmPolicy 使用 |
| `groupPolicy` | string | 否 | `"allowlist"` | 群组/频道消息策略：<br/>• `"open"` - 开放（需 @提及）<br/>• `"allowlist"` - 白名单模式<br/>• `"disabled"` - 禁用群组消息 |
| `groupAllowFrom` | string[] | 否 | `[]` | 群组/频道白名单（频道 ID 列表） |
| `requireMention` | boolean | 否 | `true` | 群组中是否需要 @提及机器人 |
| `textChunkLimit` | number | 否 | `2000` | 单条消息最大字符数，超出自动分块 |

### 配置示例

#### 1. 远程控制场景（推荐配置）

```json
{
  "channels": {
    "kook": {
      "enabled": true,
      "token": "你的Bot Token",
      "allowedUserId": "1234567890",
      "dmPolicy": "open",
      "allowFrom": ["*"],
      "groupPolicy": "disabled"
    }
  }
}
```

**说明**：只允许用户 ID `1234567890` 通过私聊控制，禁用所有群组消息。

#### 2. 团队协作场景

```json
{
  "channels": {
    "kook": {
      "enabled": true,
      "token": "你的Bot Token",
      "dmPolicy": "allowlist",
      "allowFrom": ["1234567890", "9876543210"],
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["频道ID1", "频道ID2"],
      "requireMention": true
    }
  }
}
```

**说明**：允许多个用户私聊，在指定频道中需要 @提及才响应。

#### 3. 公开服务场景

```json
{
  "channels": {
    "kook": {
      "enabled": true,
      "token": "你的Bot Token",
      "dmPolicy": "pairing",
      "groupPolicy": "open",
      "requireMention": true
    }
  }
}
```

**说明**：私聊需要配对，群组开放但需要 @提及。

## License

MIT
