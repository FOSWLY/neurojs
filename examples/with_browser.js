import { browserSecHeaders } from "@vot.js/shared/secure";

import { NeuroClient } from "../dist/index.js";

const client = new NeuroClient({
  // ! Without this headers it doesn't work in browser!
  headers: browserSecHeaders,
});

const data = {
  url: "https://youtu.be/Wd-pEeff9Rs",
  language: "en",
  extraOpts: {
    videoTitle:
      "Glamorous x 9 Am In Calabasas (Xxtristanxo Full TikTok Remix) [made by purple drip boy]",
  },
};

const res = await client.summarizeVideo(data);

console.log(res);
setTimeout(async () => {
  data.extraOpts.summarizeId = res.summarizeId;
  const finishRes = await client.summarizeVideo(data);
  console.log(finishRes);
}, res.interval);
