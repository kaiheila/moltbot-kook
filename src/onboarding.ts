import type {
  ChannelOnboardingAdapter,
  ChannelOnboardingDmPolicy,
  ClawdbotConfig,
  DmPolicy,
  WizardPrompter,
} from "clawdbot/plugin-sdk";
import { addWildcardAllowFrom, DEFAULT_ACCOUNT_ID, formatDocsLink } from "clawdbot/plugin-sdk";

import type { KookConfig } from "./types.js";
import { probeKookAccount } from "./probe.js";

const channel = "kook" as const;

function resolveKookToken(kookCfg: KookConfig | undefined): string | null {
  const token = kookCfg?.token?.trim();
  if (token) return token;

  const envToken = process.env.KOOK_BOT_TOKEN?.trim();
  if (envToken) return envToken;

  return null;
}

function setKookDmPolicy(cfg: ClawdbotConfig, dmPolicy: DmPolicy): ClawdbotConfig {
  const allowFrom =
    dmPolicy === "open"
      ? addWildcardAllowFrom(cfg.channels?.kook?.allowFrom)?.map((entry) => String(entry))
      : undefined;
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      kook: {
        ...cfg.channels?.kook,
        dmPolicy,
        ...(allowFrom ? { allowFrom } : {}),
      },
    },
  };
}

function setKookAllowFrom(cfg: ClawdbotConfig, allowFrom: string[]): ClawdbotConfig {
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      kook: {
        ...cfg.channels?.kook,
        allowFrom,
      },
    },
  };
}

function parseAllowFromInput(raw: string): string[] {
  return raw
    .split(/[\n,;]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function promptKookAllowFrom(params: {
  cfg: ClawdbotConfig;
  prompter: WizardPrompter;
}): Promise<ClawdbotConfig> {
  const existing = params.cfg.channels?.kook?.allowFrom ?? [];
  await params.prompter.note(
    [
      "Allowlist Kook DMs by user ID.",
      "You can find user ID in Kook.",
      "Examples:",
      "- 1234567890",
    ].join("\n"),
    "Kook allowlist",
  );

  while (true) {
    const entry = await params.prompter.text({
      message: "Kook allowFrom (user IDs)",
      placeholder: "1234567890, 9876543210",
      initialValue: existing[0] ? String(existing[0]) : undefined,
      validate: (value) => (String(value ?? "").trim() ? undefined : "Required"),
    });
    const parts = parseAllowFromInput(String(entry));
    if (parts.length === 0) {
      await params.prompter.note("Enter at least one user ID.", "Kook allowlist");
      continue;
    }

    const unique = [
      ...new Set([...existing.map((v) => String(v).trim()).filter(Boolean), ...parts]),
    ];
    return setKookAllowFrom(params.cfg, unique);
  }
}

async function noteKookCredentialHelp(prompter: WizardPrompter): Promise<void> {
  await prompter.note(
    [
      "1) Go to Kook Developer Portal (developer.kookapp.cn)",
      "2) Create a bot application",
      "3) Get Bot Token from bot settings",
      "4) Enable required permissions",
      "5) Invite the bot to your server",
      "Tip: you can also set KOOK_BOT_TOKEN env var.",
      `Docs: ${formatDocsLink("/channels/kook", "kook")}`,
    ].join("\n"),
    "Kook credentials",
  );
}

function setKookGroupPolicy(
  cfg: ClawdbotConfig,
  groupPolicy: "open" | "allowlist" | "disabled",
): ClawdbotConfig {
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      kook: {
        ...cfg.channels?.kook,
        enabled: true,
        groupPolicy,
      },
    },
  };
}

function setKookGroupAllowFrom(cfg: ClawdbotConfig, groupAllowFrom: string[]): ClawdbotConfig {
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      kook: {
        ...cfg.channels?.kook,
        groupAllowFrom,
      },
    },
  };
}

const dmPolicy: ChannelOnboardingDmPolicy = {
  label: "Kook",
  channel,
  policyKey: "channels.kook.dmPolicy",
  allowFromKey: "channels.kook.allowFrom",
  getCurrent: (cfg) => (cfg.channels?.kook as KookConfig | undefined)?.dmPolicy ?? "pairing",
  setPolicy: (cfg, policy) => setKookDmPolicy(cfg, policy),
  promptAllowFrom: promptKookAllowFrom,
};

export const kookOnboardingAdapter: ChannelOnboardingAdapter = {
  channel,
  getStatus: async ({ cfg }) => {
    const kookCfg = cfg.channels?.kook as KookConfig | undefined;
    const configured = Boolean(resolveKookToken(kookCfg));

    // Try to probe if configured
    let probeResult = null;
    if (configured) {
      const token = resolveKookToken(kookCfg);
      if (token) {
        try {
          probeResult = await probeKookAccount({ token });
        } catch {
          // Ignore probe errors
        }
      }
    }

    const statusLines: string[] = [];
    if (!configured) {
      statusLines.push("Kook: needs bot token");
    } else if (probeResult?.ok) {
      statusLines.push(`Kook: connected as ${probeResult.user?.username ?? "bot"}`);
    } else {
      statusLines.push("Kook: configured (connection not verified)");
    }

    return {
      channel,
      configured,
      statusLines,
      selectionHint: configured ? "configured" : "needs bot token",
      quickstartScore: configured ? 2 : 0,
    };
  },

  configure: async ({ cfg, prompter }) => {
    const kookCfg = cfg.channels?.kook as KookConfig | undefined;
    const resolved = resolveKookToken(kookCfg);
    const hasConfigToken = Boolean(kookCfg?.token?.trim());
    const canUseEnv = Boolean(!hasConfigToken && process.env.KOOK_BOT_TOKEN?.trim());

    let next = cfg;
    let token: string | null = null;

    if (!resolved) {
      await noteKookCredentialHelp(prompter);
    }

    if (canUseEnv) {
      const keepEnv = await prompter.confirm({
        message: "KOOK_BOT_TOKEN detected. Use env var?",
        initialValue: true,
      });
      if (keepEnv) {
        next = {
          ...next,
          channels: {
            ...next.channels,
            kook: { ...next.channels?.kook, enabled: true },
          },
        };
      } else {
        token = String(
          await prompter.text({
            message: "Enter Kook Bot Token",
            validate: (value) => (value?.trim() ? undefined : "Required"),
          }),
        ).trim();
      }
    } else if (hasConfigToken) {
      const keep = await prompter.confirm({
        message: "Kook bot token already configured. Keep it?",
        initialValue: true,
      });
      if (!keep) {
        token = String(
          await prompter.text({
            message: "Enter Kook Bot Token",
            validate: (value) => (value?.trim() ? undefined : "Required"),
          }),
        ).trim();
      }
    } else {
      token = String(
        await prompter.text({
          message: "Enter Kook Bot Token",
          validate: (value) => (value?.trim() ? undefined : "Required"),
        }),
      ).trim();
    }

    if (token) {
      next = {
        ...next,
        channels: {
          ...next.channels,
          kook: {
            ...next.channels?.kook,
            enabled: true,
            token,
          },
        },
      };

      // Test connection
      try {
        const probe = await probeKookAccount({ token });
        if (probe.ok) {
          await prompter.note(
            `Connected as ${probe.user?.username ?? "bot"} (ID: ${probe.user?.id ?? "unknown"})`,
            "Kook connection test",
          );
        } else {
          await prompter.note(
            `Connection failed: ${probe.error ?? "unknown error"}`,
            "Kook connection test",
          );
        }
      } catch (err) {
        await prompter.note(`Connection test failed: ${String(err)}`, "Kook connection test");
      }
    }

    // Group policy
    const groupPolicy = await prompter.select({
      message: "Group chat policy",
      options: [
        { value: "allowlist", label: "Allowlist - only respond in specific channels" },
        { value: "open", label: "Open - respond in all channels (requires mention)" },
        { value: "disabled", label: "Disabled - don't respond in channels" },
      ],
      initialValue: (next.channels?.kook as KookConfig | undefined)?.groupPolicy ?? "allowlist",
    });
    if (groupPolicy) {
      next = setKookGroupPolicy(next, groupPolicy as "open" | "allowlist" | "disabled");
    }

    // Group allowlist if needed
    if (groupPolicy === "allowlist") {
      const existing = (next.channels?.kook as KookConfig | undefined)?.groupAllowFrom ?? [];
      const entry = await prompter.text({
        message: "Group channel allowlist (channel IDs)",
        placeholder: "1234567890, 9876543210",
        initialValue: existing.length > 0 ? existing.map(String).join(", ") : undefined,
      });
      if (entry) {
        const parts = parseAllowFromInput(String(entry));
        if (parts.length > 0) {
          next = setKookGroupAllowFrom(next, parts);
        }
      }
    }

    return { cfg: next, accountId: DEFAULT_ACCOUNT_ID };
  },

  dmPolicy,

  disable: (cfg) => ({
    ...cfg,
    channels: {
      ...cfg.channels,
      kook: { ...cfg.channels?.kook, enabled: false },
    },
  }),
};
