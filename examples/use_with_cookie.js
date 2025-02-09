import { VOTAgent } from "@vot.js/node/utils/fetchAgent";

import { NeuroClient } from "../dist/index.js";

// login to any ya website and paste your `Session_id` cookie value (without `Session_id=`)
const SESSION_ID_COOKIE = process.env.SESSION_ID_COOKIE;
const client = new NeuroClient({
  fetchOpts: {
    dispatcher: new VOTAgent(),
    sessionIdCookie: SESSION_ID_COOKIE,
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
