# neurojs

[![GitHub Actions](https://github.com/FOSWLY/neurojs/actions/workflows/build.yml/badge.svg)](https://github.com/FOSWLY/neurojs/actions/workflows/build.yml)
[![npm](https://img.shields.io/bundlejs/size/@toil/neurojs)](https://www.npmjs.com/package/@toil/neurojs)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

Неофициальная библиотека для взаимодействия с Yandex Neuro API, которая поддерживает работу с JavaScript, TypeScript, а так же имеет некоторые встроенные типы для Typebox.

> [!WARNING]
> Библиотека создана исключительно в исследовательских целях и не предназначена для коммерческого использования. Все права на оригинальное программное обеспечение принадлежат их правообладателям. Библиотека не связана с оригинальными правообладателями

## Функционал

На данный момент библиотека поддерживает работу с:

- суммаризацией видео с YouTube
- суммаризация статей
- суммаризация текста
- получением ссылок на суммаризацию статей ([оф. апи](https://300.ya.ru/), требует API-ключ)
- получение существующей суммаризации по токену (`https://300.ya.ru/TOKEN`)

Библиотека поддерживает работу с [воркер-серверами](https://github.com/FOSWLY/neuro-worker), для этого необходимо создать клиент `NeuroWorkerClient` и указать домен воркер-сервера, например `neuro-worker.toil.cc`.

## Установка

> [!WARNING]
> Чтобы библиотека работала с Node.js или с браузером вам нужно выполнить дополнительную настройку или использовать с [neuro-worker](https://github.com/FOSWLY/neuro-worker). Все примеры можно увидеть [здесь](https://github.com/FOSWLY/neurojs/tree/master/examples)

Установка библиотеки с помощью Bun:

```bash
bun install @toil/neurojs
```

Установка библиотеки с помощью Node:

```bash
npm install @toil/neurojs
```

## Начало работы

Для начала работы с API необходимо создать NeuroClient. Это можно сделать с помощью пары строчек представленных ниже.

Стандартный клиент:

```ts
const client = new NeuroClient();
const result = await client.summarizeVideo({
  url: "...",
  language: "en",
});

const result2 = await client.summarizeText({
  text: "Super long text (300+ symbols)...",
});

const result3 = await client.summarizeArticle({
  url: "https://toil.cc",
});

const result4 = await client.getSharingContent({
  token: "hoOAM7gs",
});
```

Проксирование через [neuro-worker](https://github.com/FOSWLY/neuro-worker):

```ts
const client = new NeuroWorkerClient({
  host: "neuro-worker.toil.cc/browser",
  hostTH: "neuro-worker.toil.cc/th",
});
```

Больше примеров кода вы можете увидеть [здесь](https://github.com/FOSWLY/neurojs/tree/master/examples)

## Сборка

Для сборки необходимо наличие:

- [Bun](https://bun.sh/)
- [Protoc](https://github.com/protocolbuffers/protobuf/releases) (если собираете с обновлением `.proto` файла)

Не забудьте установить зависимости:

```bash
bun install
```

Запустите сборку:

```bash
bun build:all
```

Сборка без обновления proto и генерации документации:

```bash
bun build:skip-proto
```

## Тесты

Библиотека имеет минимальное покрытие тестами для проверки ее работоспособности.

Запустить тесты:

```bash
bun test
```
