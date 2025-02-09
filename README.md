# neurojs

[![GitHub Actions](https://github.com/FOSWLY/neurojs/actions/workflows/build.yml/badge.svg)](https://github.com/FOSWLY/neurojs/actions/workflows/build.yml)
[![npm](https://img.shields.io/bundlejs/size/@toil/neurojs)](https://www.npmjs.com/package/@toil/neurojs)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

An unofficial library for interaction with Yandex Neuro API, which supports working with JavaScript, TypeScript, and also has built-in parted types for Typebox.

> [!WARNING]
> The library was created exclusively for research purposes and isn't intended for commercial use. All rights to the original software belong to their respective right holders. The library isn't affiliated with the original rights holders

## Functional

Now library supports working with:

- summarize video from YouTube
- summarize articles
- get link to summarized articles ([of. api](https://300.ya.ru/), need API-key)

<!-- The library supports working with [worker servers](https://github.com/FOSWLY/neuro-worker), to do this, you need to create a `NeuroWorkerClient` client and specify the domain of the worker server, for example `neuro-worker.toil.cc`. -->

Required functionality for 1.0.0:

- [x] Summarize video from YouTube
- [x] Summarize articles and text
- [ ] Create and add support neuro-worker (like [vot-worker](https://github.com/FOSWLY/vot-worker))

## Installation

> [!WARNING]
> To work with Node.js or with Browser you need to perform additional configuration. All examples can be seen [here](https://github.com/FOSWLY/neurojs/tree/master/examples)

Install via Bun:

```bash
bun install @toil/neurojs
```

Install via Node:

```bash
npm install @toil/neurojs
```

## Getting started

To start working with API, you need to create NeuroClient. This can be done using the line provided below

Standard client:

```ts
const client = new NeuroClient();
const result = await client.summarizeVideo({
  url: "...",
  language: "en",
});
```

<!--
Proxying via [neuro-worker](https://github.com/FOSWLY/neuro-worker):

```ts
const client = new NeuroWorkerClient({
  host: "neuro-worker.toil.cc",
});
``` -->

You can see more code examples [here](https://github.com/FOSWLY/neurojs/tree/master/examples)

## Build

To build, you must have:

- [Bun](https://bun.sh/)
- [Protoc](https://github.com/protocolbuffers/protobuf/releases) (if you are building with the update of the `.proto` file)

Don't forget to install the dependencies:

```bash
bun install
```

Start building:

```bash
bun build:all
```

Build without updating proto and without generating docs:

```bash
bun build:skip-proto
```

## Tests

The library has minimal test coverage to check its performance.

Run the tests:

```bash
bun test
```
