import {
  VideoSummarizeRequest,
  VideoSummarizeResponse,
} from "./protos/video_summarize";
import type { VideoSummarizeExtraOpts } from "./types/yandex";

export abstract class VideoSummarizeProtobuf {
  static encodeVideoSummarizeRequest(
    url: string,
    language: string,
    {
      videoTitle = "",
      bypassCache = false,
      summarizeId = undefined,
    }: VideoSummarizeExtraOpts = {},
  ) {
    return VideoSummarizeRequest.encode({
      url,
      summarizeId,
      bypassCache,
      videoTitle,
      language,
      unknown1: 2,
      flags: "ab_model_control",
      unknown2: 1,
      unknown3: 1,
    }).finish();
  }

  static decodeVideoSummarizeResponse(response: ArrayBuffer) {
    return VideoSummarizeResponse.decode(new Uint8Array(response));
  }
}
