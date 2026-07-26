# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Commands

### Install dependencies
`npm install`
Installs all runtime and dev dependencies. Run once after cloning or when package.json changes.

### Run the dev server
`npm run dev`
Starts the Vite dev server with hot reload. Open the printed localhost URL. Requires the backend services (see Constant.ts) to be running for data features.

### Production build
`npm run build`
Runs `vue-tsc` type-check (`tsconfig.app.json`) and then `vite build`. Fails on type errors. Use this before releasing.

### Build only (no type-check)
`npm run build-only`
Runs `vite build` alone, skipping the type-check step. Faster for quick iteration.

### Preview the production build
`npm run preview`
Serves the built `dist/` output locally to validate the production bundle.

### Type-check
`npm run type-check`
Runs `vue-tsc --noEmit` against `tsconfig.app.json`. Use to catch type errors without bundling.

### Lint (auto-fix)
`npm run lint`
Runs ESLint over `icboluo_web` (vue/js/ts) with `--fix`. Path arg is the dir; adjust as needed.

### Format
`npm run format`
Runs Prettier with `--write src` to reformat all source files.

### Tests
There is no test runner configured (no vitest/jest in devDependencies). No test command or single-test command exists. Add a runner before introducing tests.

## Architecture Overview

This is a Vue 3 single-page application scaffolded with Vite + TypeScript. It is a frontend client for several independent local backend services (note, fund, game, user, and a stock WebSocket). The UI is built with Element Plus; charts use ECharts; HTTP uses axios; global state uses Pinia.

### Bootstrap & app shell
`main.ts` creates the Vue app and registers three plugins in order: `createPinia()`, the `router`, and the full `element-plus` library (plus `element-plus/dist/index.css`). `App.vue` is intentionally minimal — it only renders `<RouterView />`. `assets/main.css` imports `base.css` (Element Plus base theme).

### Routing (`src/router/index.ts`)
Routing uses `createWebHistory`. The key structural concept is a **layout route**: `/frontPage` renders `FrontPage.vue`, which provides the `el-container` sidebar + header shell and contains its own nested `<router-view>`. Its children (`/note`, `/tableList`, `/pictureGraph`, `/fund`, `/fundData`, `/fundMetric`, `/game`) render inside that shell. Top-level routes `/` (Login), `/home`, and `/about` are standalone. Note that `FundMetric.vue` is registered twice (as `FundWeight` and `FundMetric`) — both point to the same file.

`FrontPage.vue` is the navigation hub: `el-menu` items carry `index` values equal to route paths, and `@select` calls `router.push(path)`. To add a feature page, register it as a child of `/frontPage` and add a matching `el-menu-item` whose index is the path.

### Data access layer (`src/util/`)
This is the most important pattern to understand, because every feature view relies on it:

- **`Request.ts`** wraps axios and defines a `Res`/`ResImpl` envelope around backend responses. Backend payloads are `{ code, message, data }`; `ResImpl` flattens them so callers read `res.data`, `res.code`, `res.message` and use `res.isSuccess()` (true when code is `'0'` or `'200'`) or `isSuccessOrPopBox()` (auto `ElMessage.error` on failure). The main helpers are `post`/`simplePost` (throws on failure), `postPage`/`simplePostPage` (merges `pageNum`/`pageSize` into the param and writes pagination fields back into a `PageInfo`), and `upload`/`simpleUpload` (multipart/form-data).
- **`AxiosInterceptor.ts`** defines request/response interceptors (sets `Content-Type`, shows `ElMessage` on HTTP 401/403/404/504). **Caveat:** this module is never imported by `main.ts`, and carries a TODO noting it may not load at startup. Treat interceptors as inactive; response handling is done by `Request.ts`. Do not assume global error toasts are wired up.
- **`Constant.ts`** holds hardcoded backend base URLs: `noteUrlPre` (`:1514`), `fundUrlPre` (`:8888`), `gameUrlPre` (`:4399`), `userUrlPre` (`:7010/user`). All point to `http://127.0.0.1`. Change these when targeting a different environment.
- **`AlUtil.ts`** provides misc helpers (`toDoubleArray` for chunking lists, `percentage`) and a `SessionKey` enum used to stash values like `fundId` in `sessionStorage`.

When adding an API call, import helpers from `@/util/Request` and the right base URL from `@/util/Constant`, and handle the result via `simplePost`/`simplePostPage`.

### Reusable components (`src/components/`)
- **`BaseTable.vue`** is the central reusable table. It takes a `tableInfo` prop (`{ header, pageInfo, body }`) and renders `el-table` + `el-pagination`. `header` items extend Element Plus column props with `fieldName`/`showName`/`buttonName`/`isButtonSlot`/`buttonOperation`. It exposes `cellSlot` and `buttonSlot` scoped slots so parent views can customize cell rendering (e.g., colored values or action buttons) and emits `init`, `handlerSizeChange`, `handlerCurChange`. Views like `Fund.vue` build their `header` array declaratively and call `simplePostPage` to fill `pageInfo.list`.
- `TableUtil.vue` exposes `tableAddSerialNum` to add a row `index` property (used by `Note.vue`).
- `Common.vue` and `TheWelcome.vue`/`WelcomeItem.vue`/`icons/*` are scaffolding/placeholder components.

### Feature views (`src/views/`)
Each view is a self-contained feature wired to one backend service: `Note.vue` (time-note CRUD via `noteUrlPre`/timeNote), `Fund.vue`/`FundData.vue`/`FundMetric.vue` (fund analytics via `fundUrlPre`), `Game.vue`, `PictureGraph.vue` (ECharts graphs), `TableList.vue`, `Login.vue`, `HomeView.vue`, `AboutView.vue` (lazy-loaded). `Fund.vue` is a good reference implementation: it declares a `TableInfo` reactive object, defines a `header` array, and an `init()` that calls `simplePostPage` and post-processes rows (e.g., computing min/max, expanding maps). Note `Note.vue` still uses the older Options-style `this.$set` and `location.reload()` patterns in places — inconsistent with the `<script setup>` style used elsewhere.

### Real-time data (`src/composables/useStockWebSocket.ts`)
A composable that opens `ws://localhost:8889/ws/stock/${seasonId}`, parses JSON messages, filters `pong` heartbeats, and invokes an `onMessage` callback. It runs a 30s ping heartbeat and auto-disconnects on `onUnmounted`. Use this for live stock updates.

### State (`src/stores/`)
Pinia is installed but only `counter.ts` (a demo `useCounterStore`) exists. Feature state currently lives in component-local `reactive`/`ref`. Add stores here if shared/global state is needed.

### Path aliases
`vite.config.ts` defines `@` -> `src` (and an unused `@&`). `tsconfig.app.json` maps `@/*` -> `src/*`. Import modules with `@/...`.

### `src/note/`
This directory holds static assets and separate sub-projects (img, `myproject-ly-static`, `protal`, `vue-demo2`, `vue`, `html.html`) — NOT part of the Vite SPA bundle. Leave it alone unless intentionally editing static note content.
