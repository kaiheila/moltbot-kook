import type { ClawdbotPluginApi } from "clawdbot/plugin-sdk";
import { emptyPluginConfigSchema } from "clawdbot/plugin-sdk";
import { kookPlugin } from "./src/channel.js";
import { setKookRuntime } from "./src/runtime.js";

export { kookPlugin } from "./src/channel.js";
export { kookOnboardingAdapter } from "./src/onboarding.js";
export { probeKookAccount } from "./src/probe.js";

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
