import { expect, test } from "bun:test";
import { NeuroClient } from "../src";
import type { VideoSummarizeOpts } from "../src/types/yandex";

const client = new NeuroClient();

test("summarize video", async () => {
  const data: VideoSummarizeOpts = {
    url: "https://youtu.be/Wd-pEeff9Rs",
    language: "en",
    extraOpts: {
      videoTitle:
        "Glamorous x 9 Am In Calabasas (Xxtristanxo Full TikTok Remix) [made by purple drip boy]",
    },
  };

  const res = await client.summarizeVideo(data);

  console.log(Bun.inspect(res));
  expect(res.statusCode).toEqual(1);

  await Bun.sleep(res.pollIntervalMs);

  data.extraOpts!.sessionId = res.sessionId;
  const finishRes = await client.summarizeVideo(data);
  console.log(Bun.inspect(finishRes));
  expect(finishRes.title).not.toBeUndefined();
});
