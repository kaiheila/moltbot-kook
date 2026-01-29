# moltbot-kook

Kook 聊天平台的 Moltbot/Clawdbot 通道插件。

## 安装

```bash
# Moltbot 用户
moltbot plugins install @kookapp/moltbot-kook

# 或 Clawdbot 用户
clawdbot plugins install @kookapp/moltbot-kook
```

## 配置

### 1. 获取 Kook Bot Token

访问 [Kook 开发者平台](https://developer.kookapp.cn/bot/) 创建机器人并获取 Bot Token。

### 2. 通过 Web 界面配置（推荐）

打开 Moltbot 配置页面：

```
http://127.0.0.1:18789/chat
```

在设置中找到 Kook 通道，配置以下参数：

| 配置项 | 必填 | 说明 |
|--------|------|------|
| `token` | **是** | Kook Bot Token |
| `allowedUserId` | **强烈推荐** | 只允许此用户 ID 控制机器人（安全设置） |

**如何获取你的用户 ID**：
1. kook - 个人设置 - 高级设置 - 开发者模式 - 打开；kook 服务器频道中 右键自己的头像 - 复制ID 即可；
2. 或者给机器人发送一条消息，在日志中查看 `authorId`。

### 3. 或使用命令行配置

```bash
# Moltbot
moltbot config set channels.kook.token "你的Bot Token"
moltbot config set channels.kook.allowedUserId "你的用户ID"
moltbot config set channels.kook.enabled true

# Clawdbot
clawdbot config set channels.kook.token "你的Bot Token"
clawdbot config set channels.kook.allowedUserId "你的用户ID"
clawdbot config set channels.kook.enabled true
```

### 4. 重启服务

```bash
# Moltbot
moltbot gateway restart

# Clawdbot
clawdbot gateway restart
```

## 配置项说明

核心配置（通过 Web 界面或命令行配置）：

```yaml
channels:
  kook:
    enabled: true
    token: "你的Bot Token"         # 必填
    allowedUserId: "你的用户ID"    # 强烈推荐（安全设置）
```

## 功能特性

- ✅ WebSocket 实时连接
- ✅ 私聊和频道消息支持
- ✅ **用户白名单**（allowedUserId）- 仅允许指定用户控制
- ✅ 消息分块（自动处理长消息）
- ✅ 自动重连机制

## License

MIT
