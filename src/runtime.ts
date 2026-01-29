import type { PluginRuntime } from "clawdbot/plugin-sdk";

let runtime: PluginRuntime | null = null;

export function setKookRuntime(next: PluginRuntime) {
  runtime = next;
}

export function getKookRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("Kook runtime not initialized");
  }
  return runtime;
}
