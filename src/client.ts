import { MinimalClient, VOTJSError } from "@vot.js/core/client";
import type { ClientResponse, URLSchema } from "@vot.js/core/types/client";
import { getSecYaHeaders } from "@vot.js/shared/secure";

import type { VideoSummarizeOpts } from "./types/yandex";
import type { NeuroClientOpts } from "./types/client";
import { VideoSummarizeProtobuf } from "./protobuf";
import config from "./data/config";
import type {
  GetSharingUrlOpts,
  GetSharingUrlResponse,
  GetSharingUrlSuccess,
} from "./types/thapi";

export default class NeuroClient extends MinimalClient {
  paths = {
    summarizeVideo: "/video-summary/generation",
    sharingUrl: "/api/sharing-url",
  };

  apiToken?: string;
  hostTH: string;
  schemaTH: string;

  constructor({
    apiToken,
    host = config.host,
    hostTH = config.hostTH,
    headers = {},
    fetchOpts = {},
    ...opts
  }: NeuroClientOpts = {}) {
    super({
      host,
      headers,
      fetchOpts,
      ...opts,
    });

    this.apiToken = apiToken;
    const schemaTH = this.hostSchemaRe.exec(hostTH)?.[1] as URLSchema | null;
    this.hostTH = schemaTH ? hostTH.replace(`${schemaTH}://`, "") : hostTH;
    this.schemaTH = schemaTH ?? "https";
  }

  /**
   * The standard method for requesting the TH Backend API
   */
  async requestTH<T = unknown>(
    path: string,
    body: NonNullable<any>,
    headers: Record<string, string> = {},
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(JSON.stringify(body), {
      "Content-Type": "application/json",
      ...headers,
    });

    try {
      const res = await this.fetch(
        `${this.schemaTH}://${this.hostTH}${path}`,
        options,
      );
      const data = (await res.json()) as T;
      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  async summarizeVideo({
    url,
    language,
    extraOpts = {},
    headers = {},
  }: VideoSummarizeOpts) {
    const session = await this.getSession("summarization");
    const body = VideoSummarizeProtobuf.encodeVideoSummarizeRequest(
      url,
      language,
      extraOpts,
    );

    const path = this.paths.summarizeVideo;
    const summarizeHeaders = await getSecYaHeaders(
      "Summary",
      session,
      body,
      path,
    );

    const res = await this.request(path, body, {
      ...summarizeHeaders,
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request summarize video", res);
    }

    return VideoSummarizeProtobuf.decodeVideoSummarizeResponse(res.data);
  }

  async getSharingUrl({
    url,
  }: GetSharingUrlOpts): Promise<GetSharingUrlSuccess> {
    if (!this.apiToken) {
      throw new VOTJSError("To get a sharing url, provide an api token");
    }

    const path = this.paths.sharingUrl;
    const res = await this.requestTH<GetSharingUrlResponse>(
      path,
      {
        article_url: url,
      },
      {
        Authorization: `OAuth ${this.apiToken}`,
      },
    );

    if (!res.success) {
      throw new VOTJSError("Failed to request get sharing url", res);
    }

    return res.data as unknown as GetSharingUrlSuccess;
  }
}
