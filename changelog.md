# 1.1.0

- Added support get data by sharing token (`https://300.ya.ru/TOKEN`)
- Renamed summarizeVideo response `chapters[n].offset` -> `chapters[n].startTime`

# 1.0.0

- Added support to work with [neuro-worker](https://github.com/FOSWLY/neuro-worker)
- Changed export `protos` to `protos/*`

# 0.2.0

- Added support to **summarize text** with YaHMAC (without any auth) or with Cookies
- Added support to **summarize articles** with YaHMAC (without any auth) or with Cookies
- Added shared `Opts` and `ExtraOpts` types for Yandex API
- (!) Changed api300 response to camelCase style
- (!) Renamed summarizeVideo extra option `summarizeId` to `sessionId`
- (!) Renamed many summarizeVideo response fields:

  `summarizeId` -> `sessionId`
  `interval` -> `pollIntervalMs`
  `summarizeTitle` -> `title`
  `status` -> `statusCode`
  `chapters[n].chapterId` -> `chapters[n].id`
  `chapters[n].title` -> `chapters[n].content`
  `chapters[n].theses[i].thesisId` -> `chapters[n].theses[i].id`

# 0.1.0

- Initial release
