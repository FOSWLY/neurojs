import { expect, test } from "bun:test";
import { NeuroClient } from "../src";
import type { ArticleSummarizeOpts } from "../src/types/yandex";

const SESSION_ID_COOKIE = Bun.env.SESSION_ID_COOKIE;

test("summarize articles (with hmac)", async () => {
  const client = new NeuroClient();
  const data: ArticleSummarizeOpts = {
    url: "https://toil.cc",
    extraOpts: {
      bypassCache: true,
    },
  };

  const res = await client.summarizeArticle(data);

  // console.log(res);
  expect(res.statusCode).toEqual(1);

  await Bun.sleep(res.pollIntervalMs);

  data.extraOpts!.sessionId = res.sessionId;
  const finishRes = await client.summarizeArticle(data);
  // console.log(finishRes);
  expect(finishRes.title).not.toBe("");
});

test.skipIf(!SESSION_ID_COOKIE)(
  "summarize articles (with user cookie)",
  async () => {
    const client = new NeuroClient({
      sessionIdCookie: SESSION_ID_COOKIE,
    });
    const data: ArticleSummarizeOpts = {
      url: "https://toil.cc",
      extraOpts: {
        bypassCache: true,
      },
    };

    const res = await client.summarizeArticle(data);

    // console.log(res);
    expect(res.statusCode).toEqual(1);

    await Bun.sleep(res.pollIntervalMs);

    data.extraOpts!.sessionId = res.sessionId;
    const finishRes = await client.summarizeArticle(data);
    // console.log(finishRes);
    expect(finishRes.title).not.toBe("");
  },
);
