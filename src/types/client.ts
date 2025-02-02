import type { MinimalClientOpts } from "@vot.js/core/types/client";

export type NeuroClientOpts = MinimalClientOpts & {
  apiToken?: string;
  hostTH?: string;
};
