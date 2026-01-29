import { z } from "zod";
export { z };

const DmPolicySchema = z.enum(["open", "pairing", "allowlist"]);
const GroupPolicySchema = z.enum(["open", "allowlist", "disabled"]);

export const KookConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    token: z.string().optional(),
    name: z.string().optional(),
    allowedUserId: z.string().optional(),
    dmPolicy: DmPolicySchema.optional().default("pairing"),
    allowFrom: z.array(z.string()).optional(),
    groupPolicy: GroupPolicySchema.optional().default("allowlist"),
    groupAllowFrom: z.array(z.string()).optional(),
    requireMention: z.boolean().optional().default(true),
    textChunkLimit: z.number().int().positive().optional(),
    accounts: z
      .record(
        z.string(),
        z
          .object({
            enabled: z.boolean().optional(),
            token: z.string().optional(),
            name: z.string().optional(),
            allowedUserId: z.string().optional(),
            config: z.record(z.string(), z.unknown()).optional(),
          })
          .optional(),
      )
      .optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.dmPolicy === "open") {
      const allowFrom = value.allowFrom ?? [];
      const hasWildcard = allowFrom.some((entry) => entry.trim() === "*");
      if (!hasWildcard) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allowFrom"],
          message: 'channels.kook.dmPolicy="open" requires channels.kook.allowFrom to include "*"',
        });
      }
    }
  });
