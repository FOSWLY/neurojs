import { VOTAgent } from "@vot.js/node/utils/fetchAgent";

import { NeuroClient } from "../dist/index.js";

const client = new NeuroClient({
  fetchOpts: {
    dispatcher: new VOTAgent(),
  },
});

const data = {
  url: "https://toil.cc",
  extraOpts: {
    bypassCache: true,
  },
};

const res = await client.summarizeArticle(data);

console.log(res);
setTimeout(async () => {
  data.extraOpts.sessionId = res.sessionId;
  const finishRes = await client.summarizeArticle(data);
  console.log(finishRes);
}, res.pollIntervalMs);
