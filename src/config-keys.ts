/**
 * Kook 插件所有可配置的配置项
 */
export enum KookConfigKey {
  // 基础配置
  ENABLED = "enabled",
  TOKEN = "token",
  NAME = "name",
  
  // 安全配置
  ALLOWED_USER_ID = "allowedUserId",
  
  // 私聊策略
  DM_POLICY = "dmPolicy",
  ALLOW_FROM = "allowFrom",
  
  // 群组策略
  GROUP_POLICY = "groupPolicy",
  GROUP_ALLOW_FROM = "groupAllowFrom",
  REQUIRE_MENTION = "requireMention",
  
  // 消息配置
  TEXT_CHUNK_LIMIT = "textChunkLimit",
  
  // 多账户
  ACCOUNTS = "accounts",
}

/**
 * 当前启用的配置项列表（仅 token 和 allowedUserId）
 */
export const ENABLED_CONFIG_KEYS: KookConfigKey[] = [
  KookConfigKey.TOKEN,
  KookConfigKey.ALLOWED_USER_ID,
];

/**
 * 所有配置项列表
 */
export const ALL_CONFIG_KEYS: KookConfigKey[] = Object.values(KookConfigKey);

/**
 * 配置项说明
 */
export const CONFIG_KEY_DESCRIPTIONS: Record<KookConfigKey, string> = {
  [KookConfigKey.ENABLED]: "是否启用 Kook 通道",
  [KookConfigKey.TOKEN]: "Kook Bot Token（必需）",
  [KookConfigKey.NAME]: "账户名称",
  [KookConfigKey.ALLOWED_USER_ID]: "只允许此用户 ID 控制机器人（强烈推荐）",
  [KookConfigKey.DM_POLICY]: "私聊策略: open/pairing/allowlist",
  [KookConfigKey.ALLOW_FROM]: "私聊白名单（用户 ID 列表）",
  [KookConfigKey.GROUP_POLICY]: "群组策略: open/allowlist/disabled",
  [KookConfigKey.GROUP_ALLOW_FROM]: "群组白名单（频道 ID 列表）",
  [KookConfigKey.REQUIRE_MENTION]: "群组中是否需要 @提及机器人",
  [KookConfigKey.TEXT_CHUNK_LIMIT]: "单条消息最大字符数",
  [KookConfigKey.ACCOUNTS]: "多账户配置",
};
