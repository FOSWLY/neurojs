import { NeuroWorkerClient } from "../dist/index.js";

const client = new NeuroWorkerClient({
  // set your own host or remove this lines to use default worker host
  host: "http://127.0.0.1:7674/browser",
  hostTH: "http://127.0.0.1:7674/th",
});

const text = `Порой бывает сложно перематывать длинный ролик в надежде найти хоть что-то интересное или тот самый момент из Shorts. Или иногда хочется за ночь узнать, о чём шла речь на паре научных конференций. Для этого в Браузере есть волшебная кнопка — «Пересказать», которая экономит время и помогает лучше понять, стоит ли смотреть видео, есть ли в нём полезная информация, и сразу перейти к интересующей части.

Сегодня я расскажу про модель, которая быстро перескажет видео любой длины и покажет таймкоды для каждой части. Под катом — история о том, как мы смогли выйти за лимиты контекста модели и научить её пересказывать даже очень длинные видео. `;

const data = {
  text,
  extraOpts: {
    bypassCache: true,
  },
};

const res = await client.summarizeText(data);

console.log(res);
setTimeout(async () => {
  data.extraOpts.sessionId = res.sessionId;
  const finishRes = await client.summarizeText(data);
  console.log(finishRes);
}, res.pollIntervalMs);
