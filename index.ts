import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { kookPlugin } from "./src/channel.js";
import { setKookRuntime } from "./src/runtime.js";

export { kookPlugin } from "./src/channel.js";
export { probeKookAccount } from "./src/probe.js";
export {
  KookConfigKey,
  ENABLED_CONFIG_KEYS,
  ALL_CONFIG_KEYS,
  CONFIG_KEY_DESCRIPTIONS,
} from "./src/config-keys.js";

const plugin = {
  id: "openclaw-kook",
  name: "Kook",
  description: "Kook channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setKookRuntime(api.runtime);
    api.registerChannel({ plugin: kookPlugin });
  },
};

export default plugin;
