import type { ClawdbotPluginApi } from "clawdbot/plugin-sdk";
import { emptyPluginConfigSchema } from "clawdbot/plugin-sdk";

import { kookPlugin } from "./channel.js";
import { setKookRuntime } from "./runtime.js";

const plugin = {
  id: "moltbot-kook",
  name: "Kook",
  description: "Kook channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: ClawdbotPluginApi) {
    setKookRuntime(api.runtime);
    api.registerChannel({ plugin: kookPlugin });
  },
};

export default plugin;
