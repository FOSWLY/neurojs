import { MinimalClient, VOTJSError } from "@vot.js/core/client";
import type { ClientResponse, URLSchema } from "@vot.js/core/types/client";
import type { RequestHeaders } from "@vot.js/shared/types/data";
import { getSecYaHeaders } from "@vot.js/shared/secure";

import type {
  ArticleSummarizeOpts,
  ArticleSummarizeResponse,
  SummarizeResponse,
  SummarizeType,
  TextSummarizeOpts,
  TextSummarizeResponse,
  VideoSummarizeOpts,
} from "./types/yandex";
import type { NeuroClientOpts } from "./types/client";
import { VideoSummarizeProtobuf } from "./protobuf";
import config from "./data/config";
import type { GetSharingUrlOpts, GetSharingUrlSuccess } from "./types/thapi";
import { snakeToCamel } from "./utils/utils";

export default class NeuroClient extends MinimalClient {
  /**
   * /api/neuro/generation - requires sec headers
   * /api/generation - requires session cookie
   * /api/sharing-url - requires API Token
   */
  paths = {
    summarizeVideo: "/video-summary/generation",
    summarizeWithCookie: "/api/generation",
    summarizeWithSec: "/api/neuro/generation",
    sharingUrl: "/api/sharing-url",
  };

  /**
   * Optional field.
   *
   * Allow use official "API" (only allow get summarized link to 300.ya.ru)
   */
  apiToken?: string;
  /**
   * Optional field.
   * Allow use all summarizeXX methods except summarizeVideo with outdated YaHMAC key.
   * To enable it login to any ya website and set your `Session_id` cookie value
   *
   * Lifetime: ~6 months
   */
  sessionIdCookie?: string;
  hostTH: string;
  schemaTH: string;

  constructor({
    apiToken,
    sessionIdCookie,
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
    this.sessionIdCookie = sessionIdCookie;
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
      Accept: "application/json",
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
    const res = await this.requestTH(
      path,
      {
        article_url: url,
      },
      {
        Authorization: `OAuth ${this.apiToken}`,
      },
    );

    const result = snakeToCamel<ClientResponse<GetSharingUrlSuccess>>(res);
    if (!result.success) {
      throw new VOTJSError("Failed to request get sharing url", res);
    }

    return result.data;
  }

  getTHSummarizeSec(): {
    path: string;
    headers: Record<string, string>;
  } {
    const origin = `${this.schemaTH}://${this.hostTH}`;
    if (this.sessionIdCookie) {
      return {
        path: this.paths.summarizeWithCookie,
        headers: {
          Cookie: `Session_id=${this.sessionIdCookie}`,
          Origin: origin,
          Referer: `${origin}/summary`,
        },
      };
    }

    return {
      path: this.paths.summarizeWithSec,
      headers: {
        "X-Yandex-Browser-Locale": "ru",
        "X-Neuro-Page": "yes",
        Origin: origin,
        Referer: `${origin}/neuro`,
      },
    };
  }

  protected async summarizeImpl<
    T extends SummarizeResponse<Exclude<SummarizeType, "video">>,
  >(
    type: Exclude<SummarizeType, "video">,
    body: Record<string, unknown>,
    headers: RequestHeaders,
  ) {
    const { path, headers: secHeaders } = this.getTHSummarizeSec();
    if (!this.sessionIdCookie) {
      const session = await this.getSession("neuroapi");
      const secYaHeaders = await getSecYaHeaders(
        "Ya-Summary",
        session,
        undefined,
        path,
      );

      Object.assign(secHeaders, secYaHeaders);
    }

    const res = await this.requestTH(path, body, {
      ...secHeaders,
      ...headers,
    });
    const result = snakeToCamel<ClientResponse<T>>(res);
    if (!result.success) {
      throw new VOTJSError(`Failed to request summarize ${type}`, res);
    }

    return result.data;
  }

  async summarizeArticle({
    url,
    extraOpts: { sessionId, bypassCache = false } = {},
    headers = {},
  }: ArticleSummarizeOpts): Promise<ArticleSummarizeResponse> {
    const type = "article";
    const body = sessionId
      ? { session_id: sessionId, type }
      : {
          article_url: url,
          ignore_cache: bypassCache,
          type,
        };
    return this.summarizeImpl(type, body, headers);
  }

  async summarizeText({
    text,
    extraOpts: { sessionId, bypassCache = false } = {},
    headers = {},
  }: TextSummarizeOpts): Promise<TextSummarizeResponse> {
    const type = "text";
    const body = sessionId
      ? { session_id: sessionId, type }
      : {
          text,
          ignore_cache: bypassCache,
          type,
        };
    return this.summarizeImpl(type, body, headers);
  }
}

export class NeuroWorkerClient extends NeuroClient {
  constructor(opts: NeuroClientOpts = {}) {
    opts.host = opts.host ?? config.hostWorker;
    opts.hostTH = opts.hostTH ?? config.hostTHWorker;
    super(opts);
  }

  async request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      JSON.stringify({
        headers: {
          ...this.headers,
          ...headers,
        },
        body: Array.from(body),
      }),
      {
        "Content-Type": "application/json",
      },
      method,
    );

    try {
      const res = await this.fetch(
        `${this.schema}://${this.host}${path}`,
        options,
      );
      const data = (await res.arrayBuffer()) as T;
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

  async requestTH<T = unknown>(
    path: string,
    body: NonNullable<unknown>,
    headers: Record<string, string> = {},
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      JSON.stringify({
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        body,
      }),
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      "POST",
    );

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
}
