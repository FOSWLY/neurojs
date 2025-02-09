import { VOTAgent } from "@vot.js/node/utils/fetchAgent";
// import { VOTProxyAgent } from "@vot.js/node/utils/fetchAgent";

import { NeuroClient } from "../dist/index.js";

const client = new NeuroClient({
  fetchOpts: {
    // ! Without VOTAgent Node.js doesn't work!
    dispatcher: new VOTAgent(),
    // You can pass VOTProxyAgent to set HTTP(S) proxy
    // dispatcher: new VOTProxyAgent(
    //   "[<PROTOCOL>://]<USERNAME>:<PASSWORD>@<HOST>[:<port>]",
    // ),
  },
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
  data.extraOpts.sessionId = res.sessionId;
  const finishRes = await client.summarizeVideo(data);
  console.log(finishRes);
}, res.pollIntervalMs);
