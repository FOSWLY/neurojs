import type { RequestHeaders } from "@vot.js/shared/types/data";

export type SharedSummarizeOpts<T> = {
  extraOpts?: T;
  headers?: RequestHeaders;
};
export type SharedSummarizeExtraOpts = {
  bypassCache?: boolean;
  sessionId?: string;
};

export enum SummarizeStatus {
  // unknown for protobuf compatibility
  UNKNOWN,
  // real statuses
  GENERATING,
  SUCCESS,
  FAILED,
}

export type SummarizeType = "article" | "text" | "video";
export type MinimalSummarizeResponse<T extends SummarizeType> = {
  pollIntervalMs: number;
  sessionId: string;
  statusCode: SummarizeStatus;
  title: string; // website title
  type: T;
};

export type SummarizeResponse<T extends SummarizeType> =
  MinimalSummarizeResponse<T> & {
    chapters: SummarizeChapter[];
    haveChapters: boolean;
    normalizedUrl: string;
    sharingUrl: string; // link to 300.ya.ru
    summaryAgeSeconds: number;
    thesis: SummarizeThesis[];
  };

export type SummarizeThesis = {
  id: number;
  content: string;
};

export type SummarizeThesisWithLink = SummarizeThesis & {
  link: string;
};

export type SummarizeChapter<
  T extends SummarizeThesis = SummarizeThesisWithLink,
> = {
  id: number;
  content: string;
  theses: T[];
};

export type VideoSummarizeChapter = SummarizeChapter<SummarizeThesis> & {
  offset: number;
};

export type VideoSummarizeExtraOpts = SharedSummarizeExtraOpts & {
  videoTitle?: string;
};
export type VideoSummarizeOpts =
  SharedSummarizeOpts<VideoSummarizeExtraOpts> & {
    url: string;
    language: string;
  };
export type VideoSummarizeResponse = MinimalSummarizeResponse<"video"> & {
  chapters: VideoSummarizeChapter[];
  unknown0?: string;
};

export type ArticleSummarizeExtraOpts = SharedSummarizeExtraOpts;
export type ArticleSummarizeOpts =
  SharedSummarizeOpts<ArticleSummarizeExtraOpts> & {
    url: string;
  };
export type ArticleSummarizeResponse = SummarizeResponse<"article">;

export type TextSummarizeExtraOpts = SharedSummarizeExtraOpts;
export type TextSummarizeOpts =
  SharedSummarizeOpts<ArticleSummarizeExtraOpts> & {
    text: string;
  };
export type TextSummarizeResponse = SummarizeResponse<"text">;
