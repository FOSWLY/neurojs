import { VOTAgent } from "@vot.js/node/utils/fetchAgent";

import { NeuroClient } from "../dist/index.js";

const API_TOKEN = process.env.SHARING_API_TOKEN;
const ARTICLE_URL = "https://habr.com/ru/news/729422";

const client = new NeuroClient({
  apiToken: API_TOKEN,
  fetchOpts: {
    dispatcher: new VOTAgent(),
  },
});

const res = await client.getSharingUrl({
  url: ARTICLE_URL,
});

// return { status: 'success', sharingUrl: 'https://300.ya.ru/...' }
// or throw
console.log(res);

// works without API_TOKEN
const resContent = await client.getSharingContent({
  token: "hoOAM7gs",
});

console.log(resContent);
