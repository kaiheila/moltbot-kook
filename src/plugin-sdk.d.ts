// Type declarations for clawdbot/plugin-sdk
// These are minimal type definitions for building the plugin

declare module 'clawdbot/plugin-sdk' {
  export interface PluginRuntime {
    runtime: string;
    config: {
      loadConfig(): Record<string, unknown>;
    };
    channel: {
      routing: {
        resolveAgentRoute(params: {
          cfg: Record<string, unknown>;
          channel: string;
          accountId: string;
          teamId?: string;
          peer: { kind: string; id: string };
        }): { sessionKey: string; agentId?: string; accountId: string };
      };
      reply: {
        finalizeInboundContext(params: Record<string, unknown>): Record<string, unknown>;
        createReplyDispatcherWithTyping(params: Record<string, unknown>): {
          dispatcher: unknown;
          replyOptions: Record<string, unknown>;
          markDispatchIdle(): void;
        };
        dispatchReplyFromConfig(params: Record<string, unknown>): Promise<void>;
        resolveHumanDelayConfig(cfg: Record<string, unknown>, agentId?: string): number;
      };
      text: {
        resolveTextChunkLimit(cfg: Record<string, unknown>, channel: string, accountId: string, options?: Record<string, unknown>): number;
        resolveMarkdownTableMode(cfg: Record<string, unknown>, channel: string, accountId: string): Record<string, unknown>;
        chunkMarkdownTextWithMode(text: string, limit: number, mode: Record<string, unknown>): string[];
        hasControlCommand(text: string, cfg: Record<string, unknown>): boolean;
      };
      debounce: {
        resolveInboundDebounceMs(cfg: Record<string, unknown>, channel: string): number;
        createInboundDebouncer(options: Record<string, unknown>): unknown;
      };
      discord?: {
        messageActions: {
          listActions(ctx: unknown): unknown;
          extractToolSend(ctx: unknown): unknown;
          handleAction(ctx: unknown): Promise<void>;
        };
      };
    };
    error?(message: string, ...args: unknown[]): void;
  }

  export interface ClawdbotConfig {
    channels?: Record<string, unknown>;
  }

  export interface ReplyPayload {
    text?: string;
    mediaUrl?: string;
    mediaUrls?: string[];
  }

  export function emptyPluginConfigSchema(): Record<string, unknown>;

  export const DEFAULT_ACCOUNT_ID: string;

  export function applyAccountNameToChannelSection(params: Record<string, unknown>): Record<string, unknown>;

  export function deleteAccountFromConfigSection(params: Record<string, unknown>): Record<string, unknown>;

  export function setAccountEnabledInConfigSection(params: Record<string, unknown>): Record<string, unknown>;

  export function migrateBaseNameToDefaultAccount(params: Record<string, unknown>): Record<string, unknown>;

  export function normalizeAccountId(accountId: string): string;

  export function formatPairingApproveHint(channel: string): string;

  export function buildChannelConfigSchema(schema: Record<string, unknown>): Record<string, unknown>;
}
