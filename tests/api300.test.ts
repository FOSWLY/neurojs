import { expect, test } from "bun:test";
import { NeuroClient } from "../src";

const API_TOKEN = Bun.env.SHARING_API_TOKEN;
const client = new NeuroClient({
  apiToken: API_TOKEN,
});

test.if(!!API_TOKEN)("sharing url", async () => {
  const url = "https://habr.com/ru/news/729422";
  const res = await client.getSharingUrl({
    url,
  });

  // console.log(res);
  expect(res.sharingUrl).toEqual("https://300.ya.ru/3fOcYRBL");
});

test("get sharing content", async () => {
  const res = await client.getSharingContent({
    token: "hoOAM7gs",
  });

  // console.log(res);
  expect(res.sharingUrl).toEqual("https://300.ya.ru/hoOAM7gs");
});
