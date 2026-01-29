import type { z } from "zod";
import type { KookConfigSchema } from "./config-schema.js";

export type KookConfig = z.infer<typeof KookConfigSchema>;
