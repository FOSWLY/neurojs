import {
  VideoSummarizeRequest,
  VideoSummarizeResponse,
} from "./protos/video_summarize";
import {
  type VideoSummarizeExtraOpts,
  type VideoSummarizeResponse as YaVideoSummarizeResponse,
  SummarizeStatus,
} from "./types/yandex";

export abstract class VideoSummarizeProtobuf {
  static encodeVideoSummarizeRequest(
    url: string,
    language: string,
    {
      videoTitle = "",
      bypassCache = false,
      sessionId = undefined,
    }: VideoSummarizeExtraOpts = {},
  ) {
    return VideoSummarizeRequest.encode({
      url,
      sessionId,
      bypassCache,
      videoTitle,
      language,
      unknown1: 2,
      flags: "ab_model_control",
      unknown2: 1,
      unknown3: 1,
    }).finish();
  }

  static protoStatusToReal(statusCode: number): SummarizeStatus {
    switch (statusCode) {
      case 0:
        return SummarizeStatus.SUCCESS;
      case 1:
        return SummarizeStatus.GENERATING;
      default:
        return SummarizeStatus.UNKNOWN;
    }
  }

  static decodeVideoSummarizeResponse(
    response: ArrayBuffer,
  ): YaVideoSummarizeResponse {
    const { statusCode, title, ...data } = VideoSummarizeResponse.decode(
      new Uint8Array(response),
    );
    return {
      statusCode: VideoSummarizeProtobuf.protoStatusToReal(statusCode),
      title: title ?? "",
      type: "video",
      ...data,
    };
  }
}
