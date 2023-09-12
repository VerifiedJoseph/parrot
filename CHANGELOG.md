# Changelog

All notable changes to this project are documented in this file.

## [1.7.4](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.7.4) - 2023-09-12

* Updated docker-compose to drop all capabilities and set `no-new-privileges`. ([#229](https://github.com/VerifiedJoseph/parrot/pull/229), [`a07ff62`](https://github.com/VerifiedJoseph/parrot/commit/a07ff624027e5fc46ccedc724bb7ff89ad6f1fec))
* Dockerfile: Updated Nginx to run as user nobody. ([#229](https://github.com/VerifiedJoseph/parrot/pull/229), [`a07ff62`](https://github.com/VerifiedJoseph/parrot/commit/a07ff624027e5fc46ccedc724bb7ff89ad6f1fec))
* Dockerfile: Updated Nginx to 1.25.2-alpine3.18-slim. ([#228](https://github.com/VerifiedJoseph/parrot/pull/228), [`928181d`](https://github.com/VerifiedJoseph/parrot/commit/928181d1e198d60f10cccf3a349c88741b6aa8e8))
* Dockerfile: Updated Node.js to 18.17.1-alpine3.17. ([#227](https://github.com/VerifiedJoseph/parrot/pull/227), [`9c2f149`](https://github.com/VerifiedJoseph/parrot/commit/9c2f149bdc13035c84568f3f570100a4abab09b8))

## [1.7.3](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.7.3) - 2023-09-09

* docker-build: Fixed adding multi-arch image description ([#224](https://github.com/VerifiedJoseph/parrot/pull/224), [`1289eda`](https://github.com/VerifiedJoseph/parrot/commit/1289edad224d4a7c2ab0f4635a52ab1cba3423b3))

## [1.7.2](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.7.2) - 2023-09-09

* Docker: Changed Nginx port to 8080 ([#219](https://github.com/VerifiedJoseph/parrot/pull/219), [`445d30c`](https://github.com/VerifiedJoseph/parrot/commit/445d30ce7d7a5d94ae7fed5613362e4d54174591))

## [1.7.1](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.7.1) - 2023-08-28

* Downgraded node version to 18.17 ([#208](https://github.com/VerifiedJoseph/parrot/pull/208), [`886d0cb`](https://github.com/VerifiedJoseph/parrot/commit/886d0cb90282b1777a793aa9ad4ec18e0d3297da))

## [1.7.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.7.0) - 2023-08-28

* Bump papaparse from 5.3.2 to 5.4.1 ([#125](https://github.com/VerifiedJoseph/parrot/pull/125), [`b83074b`](https://github.com/VerifiedJoseph/parrot/commit/b83074b03cd886b2725417d24a52e5523d352d07))
* Improve CSV detection ([#99](https://github.com/VerifiedJoseph/parrot/pull/99), [`63f3151`](https://github.com/VerifiedJoseph/parrot/commit/63f3151c9a79cdaafda30883fff6f594c63e0a0d))
* Rewrite event handling ([#206](https://github.com/VerifiedJoseph/parrot/pull/206), [`efea30a`](https://github.com/VerifiedJoseph/parrot/commit/efea30a796154183b5dfbcb2c298ea240e8ea993))

## [1.6.8](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.8) - 2023-01-11

* Minor css input changes. ([#75](https://github.com/VerifiedJoseph/parrot/pull/75), [`34c2cc4`](https://github.com/VerifiedJoseph/parrot/commit/34c2cc4b91055d60e29af227280e8fdfe8c285ba))

## [1.6.7](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.7) - 2022-12-28

* Improved button accessibility. ([#68](https://github.com/VerifiedJoseph/parrot/pull/68) [#73](https://github.com/VerifiedJoseph/parrot/pull/73), [`dbf9f59`](https://github.com/VerifiedJoseph/parrot/commit/dbf9f59333796c72027453faa3f81c3b848372ad), [`846002d`](https://github.com/VerifiedJoseph/parrot/commit/846002dc784eadbc56c19560f771ace3c017af6d))

## [1.6.6](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.6) - 2022-12-13

* Added css-minimizer-webpack-plugin to optimize and minify CSS. ([#64](https://github.com/VerifiedJoseph/parrot/pull/64), [`40f0b33`](https://github.com/VerifiedJoseph/parrot/commit/40f0b33a40a1d07542b61300cc4fed6e274caa66))

## [1.6.5](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.5) - 2022-12-12

* Rewrote options CSS to use display flex. ([#58](https://github.com/VerifiedJoseph/parrot/pull/58), [`6c074db`](https://github.com/VerifiedJoseph/parrot/commit/6c074db13cc2b0c5568ce4d2c4fad30e31fbd1d0))
* Added event listeners for enter key. ([#55](https://github.com/VerifiedJoseph/parrot/pull/55), [`6bfe3af`](https://github.com/VerifiedJoseph/parrot/commit/6bfe3af6c50b9ce80fc5c20ed3897e595e9e673e))
* Changed filename box width. ([#56](https://github.com/VerifiedJoseph/parrot/pull/56), [`9c6f4b0`](https://github.com/VerifiedJoseph/parrot/commit/9c6f4b0e9d2967eb36d4d52b2faa402f1ae47577))

## [1.6.4](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.4) - 2022-12-10

* Included version number in webpack html. ([#53](https://github.com/VerifiedJoseph/parrot/pull/53), [`7b43f20`](https://github.com/VerifiedJoseph/parrot/commit/7b43f20d593d105cfa1bec6d641a31664ad09e3c))
* Reworked inputs on small screens. ([#50](https://github.com/VerifiedJoseph/parrot/pull/50), [`11123cc`](https://github.com/VerifiedJoseph/parrot/commit/11123cc3dc15d5018a0fda05871c39782562f667))
* Removed 'unsafe-inline' keyword from content security policy. ([#51](https://github.com/VerifiedJoseph/parrot/pull/51), [`35433a0`](https://github.com/VerifiedJoseph/parrot/commit/35433a08a5200aab91e846618a8a7171c6b477f3))
* Added custom file input css. ([#47](https://github.com/VerifiedJoseph/parrot/pull/47), [`5d66b01`](https://github.com/VerifiedJoseph/parrot/commit/5d66b014a869e27584b85324c33727202f2a4e64))

## [1.6.3](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.3) - 2022-12-09

* Updated light and dark mode CSS. ([#44](https://github.com/VerifiedJoseph/parrot/pull/44), [#45](https://github.com/VerifiedJoseph/parrot/pull/45), [`97c3d3c`](https://github.com/VerifiedJoseph/parrot/commit/97c3d3ccf8f9f9738d9139e29b9bf00cd12f6469), [`b966b9f`](https://github.com/VerifiedJoseph/parrot/commit/b966b9f5918be6bbd73b1633292aa923d8206043))

## [1.6.2](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.2) - 2022-12-08

* Fixed media error handling. ([#41](https://github.com/VerifiedJoseph/parrot/pull/41), [`1a32ca5`](https://github.com/VerifiedJoseph/parrot/commit/1a32ca581dc337ef60e78be05d67cb465586848b))
* Updated dark mode ([#42](https://github.com/VerifiedJoseph/parrot/pull/42), [`11da732`](https://github.com/VerifiedJoseph/parrot/commit/11da732f00a67aa0b09eabe87246f87335cbbe23))

## [1.6.1](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.1) - 2022-12-08

* Fixed image order in tweets. ([#36](https://github.com/VerifiedJoseph/parrot/pull/36), [`d2951bc`](https://github.com/VerifiedJoseph/parrot/commit/d2951bc17d005c8c765b74b15b7f23b08dda79be))

## [1.6.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.6.0) - 2022-12-06

* Added tweet search. ([#26](https://github.com/VerifiedJoseph/parrot/pull/26), [`1c0209d`](https://github.com/VerifiedJoseph/parrot/commit/1c0209deb8411638993bcbedc31795bf4cd14e98))

## [1.5.1](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.5.1) - 2022-12-06

* Added opencontainer labels to Dockerfile. ([#18](https://github.com/VerifiedJoseph/parrot/pull/18), [`780d6f3`](https://github.com/VerifiedJoseph/parrot/commit/780d6f37beb141b040af43c8b394d7ecd40b27bb))

## [1.5.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.5.0) - 2022-12-06

* Added Dockerfile and build workflow. ([#14](https://github.com/VerifiedJoseph/parrot/pull/14), [`c7c517d`](https://github.com/VerifiedJoseph/parrot/commit/c7c517dbcfc8c3647990b540cd004e73bb05ee39))

## [1.4.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.4.0) - 2022-11-29

* Added dark mode. ([#11](https://github.com/VerifiedJoseph/parrot/pull/11), [`8ab561f`](https://github.com/VerifiedJoseph/parrot/commit/8ab561fb91e1747d4345ced2140cf038ad0ef1cd))

## [1.3.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.3.0) - 2022-11-25

* Rewrote project to use Webpack. ([#8](https://github.com/VerifiedJoseph/parrot/pull/8), [`b4f806b`](https://github.com/VerifiedJoseph/parrot/commit/b4f806b509b3df6b29da787e2e058ae05bfe91c1))

## [1.2.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.2.0) - 2022-11-22

* Reworked filters and added media filter. ([#2](https://github.com/VerifiedJoseph/parrot/pull/2), [`01e5262`](https://github.com/VerifiedJoseph/parrot/commit/01e5262c4a388c8b98143f21e1a4491c44e2a1c3))
* Added Autolinker.js dependency. ([#3](https://github.com/VerifiedJoseph/parrot/pull/3), [`c54b54c`](https://github.com/VerifiedJoseph/parrot/commit/c54b54c0e68fafc545d07c7ecbdc327c8609d820))

## [1.1.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.1.0) - 2022-11-21

* Renamed project. ([#1](https://github.com/VerifiedJoseph/parrot/pull/1), [`f44173a`](https://github.com/VerifiedJoseph/parrot/commit/f44173ab8a80366c2d4591924f25b086aa438aaf))

## [1.0.0](https://github.com/VerifiedJoseph/parrot/releases/tag/v1.0.0) - 2022-11-21
Initial release
