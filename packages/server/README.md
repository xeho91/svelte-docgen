# `@svelte-docgen/server`

![NPM Version](https://img.shields.io/npm/v/@svelte-docgen/server?style=for-the-badge&logo=npm)

This package provides a simple HTTP server, to allow UI apps request _on demand_ documentation data about Svelte component(s).

In the background, this server creates TypeScript Compiler API program instance _(cached)_.
This solution prevents from necessity of starting a new program every time, given that the cold start of `tsc` takes a time.

Server is powered by [Hono](https://github.com/honojs/hono) with cross-runtime-friendly and optimization in mind.

## Installation

Use your runtime's package manager of your choice.
For example _([`pnpm`](https://github.com/pnpm/pnpm) for [Node.js](https://github.com/nodejs/node))_:

```sh
pnpm install --save-dev @svelte-docgen/server
```

### Prerequisites

This package depends on the following packages _(peer dependencies)_ to be existent in your project:

- `svelte`
- `svelte-docgen`
- `typescript`

---

## Usage

Depending on what runtime you want to use, the API for each of them should remain the same.

```js
import server from "@svelte-docgen/<runtime-name>";

/** Start the server. */
server.serve();

/** Send a request for specific `*.svelte` component file. */
server.request({
  /* options */
});
```

### Bun

```js
import server from "@svelte-docgen/bun";
```

### Deno

```js
import server from "@svelte-docgen/deno";
```

### Node

```js
import server from "@svelte-docgen/node";
```

### Options

| Name       | Required? | Description                                                                                                                                    |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `filepath` | **yes**   | Path to the `*.svelte` component file.                                                                                                         |
| `source`   | _no_      | Svelte component source code. You can read the component file by yourself, so the server will skip attempt to read the source - synchronously. |
| `keys`     | _no_      | Pick specific keys from the `ParsedComponent` to be generated.                                                                                 |
