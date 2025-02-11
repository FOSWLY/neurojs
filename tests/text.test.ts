import { expect, test } from "bun:test";
import { NeuroClient, NeuroWorkerClient } from "../src";
import type { TextSummarizeOpts } from "../src/types/yandex";

const SESSION_ID_COOKIE = Bun.env.SESSION_ID_COOKIE;
const text = `Порой бывает сложно перематывать длинный ролик в надежде найти хоть что-то интересное или тот самый момент из Shorts. Или иногда хочется за ночь узнать, о чём шла речь на паре научных конференций. Для этого в Браузере есть волшебная кнопка — «Пересказать», которая экономит время и помогает лучше понять, стоит ли смотреть видео, есть ли в нём полезная информация, и сразу перейти к интересующей части.

Сегодня я расскажу про модель, которая быстро перескажет видео любой длины и покажет таймкоды для каждой части. Под катом — история о том, как мы смогли выйти за лимиты контекста модели и научить её пересказывать даже очень длинные видео. `;

const shortText = `привет тестер!`;

test("summarize text (with hmac)", async () => {
  const client = new NeuroClient();
  const data: TextSummarizeOpts = {
    text,
    extraOpts: {
      bypassCache: true,
    },
  };

  const res = await client.summarizeText(data);

  // console.log(res);
  expect(res.statusCode).toEqual(1);

  await Bun.sleep(res.pollIntervalMs);

  data.extraOpts!.sessionId = res.sessionId;
  const finishRes = await client.summarizeText(data);
  // console.log(finishRes);
  expect(finishRes.thesis.length).not.toBe(0);
});

test("summarize text (with hmac and neuroworker)", async () => {
  const client = new NeuroWorkerClient();
  const data: TextSummarizeOpts = {
    text,
    extraOpts: {
      bypassCache: true,
    },
  };

  const res = await client.summarizeText(data);

  // console.log(res);
  expect(res.statusCode).toEqual(1);

  await Bun.sleep(res.pollIntervalMs);

  data.extraOpts!.sessionId = res.sessionId;
  const finishRes = await client.summarizeText(data);
  // console.log(finishRes);
  expect(finishRes.thesis.length).not.toBe(0);
});

test("except with summarize short text (with hmac)", async () => {
  const client = new NeuroClient();
  const data: TextSummarizeOpts = {
    text: shortText,
    extraOpts: {
      bypassCache: true,
    },
  };

  const res = await client.summarizeText(data);

  // console.log(res);
  expect(res.statusCode).toEqual(3);
});

test.skipIf(!SESSION_ID_COOKIE)(
  "summarize text (with user cookie)",
  async () => {
    const client = new NeuroClient({
      sessionIdCookie: SESSION_ID_COOKIE,
    });
    const data: TextSummarizeOpts = {
      text,
      extraOpts: {
        bypassCache: true,
      },
    };

    const res = await client.summarizeText(data);

    // console.log(res);
    expect(res.statusCode).toEqual(1);

    await Bun.sleep(res.pollIntervalMs);

    data.extraOpts!.sessionId = res.sessionId;
    const finishRes = await client.summarizeText(data);
    // console.log(finishRes);
    expect(finishRes.thesis.length).not.toBe(0);
  },
);
