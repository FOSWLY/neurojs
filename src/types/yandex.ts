import type { RequestHeaders } from "@vot.js/shared/types/data";

export type VideoSummarizeExtraOpts = {
  videoTitle?: string;
  bypassCache?: boolean;
  summarizeId?: string;
};

export type VideoSummarizeOpts = {
  url: string;
  language: string;
  extraOpts?: VideoSummarizeExtraOpts;
  headers?: RequestHeaders;
};
