import path from "node:path";
import url from "node:url";

import { describe, it } from "vitest";

import { createServer } from "./mod.js";
import { NodeServer } from "./server.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("createServer", () => {
	it("creates instance of NodeServer", ({ expect }) => {
		expect(createServer()).toBeInstanceOf(NodeServer);
	});
});

describe("NodeServer", () => {
	describe("start()", () => {
		it("creates instance of server - is running", ({ expect }) => {
			const server = createServer();
			server.start();
			expect(server.instance).toBeDefined();
			server.shutdown();
		});
	});

	describe("request()", () => {
		it("returns parsed docgen data on valid request", async ({ expect }) => {
			const server = createServer();
			server.start();
			const data = await server.request({
				filepath: path.join(__dirname, "..", "..", "examples", "test.svelte"),
			});
			expect(data).toMatchInlineSnapshot(`
				{
				  "exports": Map {},
				  "isLegacy": false,
				  "props": Map {
				    "custom" => {
				      "isBindable": false,
				      "isExtended": true,
				      "isOptional": false,
				      "sources": Set {
				        "/packages/server/examples/test.svelte",
				      },
				      "tags": [],
				      "type": {
				        "kind": "string",
				      },
				    },
				    "children" => {
				      "isBindable": false,
				      "isExtended": true,
				      "isOptional": true,
				      "sources": Set {
				        "/packages/server/examples/test.svelte",
				      },
				      "tags": [],
				      "type": {
				        "kind": "union",
				        "nonNullable": {
				          "alias": "Snippet",
				          "calls": [
				            {
				              "parameters": [
				                {
				                  "isOptional": false,
				                  "name": "args",
				                  "type": {
				                    "elements": [],
				                    "isReadonly": false,
				                    "kind": "tuple",
				                  },
				                },
				              ],
				              "returns": {
				                "kind": "intersection",
				                "types": [
				                  {
				                    "kind": "interface",
				                    "members": Map {
				                      "{@render ...} must be called with a Snippet" => {
				                        "isOptional": false,
				                        "isReadonly": false,
				                        "type": {
				                          "kind": "literal",
				                          "subkind": "string",
				                          "value": "import type { Snippet } from 'svelte'",
				                        },
				                      },
				                    },
				                  },
				                  {
				                    "kind": "literal",
				                    "subkind": "symbol",
				                  },
				                ],
				              },
				            },
				          ],
				          "kind": "function",
				          "sources": Set {
				            /node_modules/.pnpm/svelte@<semver>/node_modules/svelte/types/index.d.ts,
				          },
				        },
				        "types": [
				          {
				            "kind": "undefined",
				          },
				          {
				            "alias": "Snippet",
				            "calls": [
				              {
				                "parameters": [
				                  {
				                    "isOptional": false,
				                    "name": "args",
				                    "type": {
				                      "elements": [],
				                      "isReadonly": false,
				                      "kind": "tuple",
				                    },
				                  },
				                ],
				                "returns": {
				                  "kind": "intersection",
				                  "types": [
				                    {
				                      "kind": "interface",
				                      "members": Map {
				                        "{@render ...} must be called with a Snippet" => {
				                          "isOptional": false,
				                          "isReadonly": false,
				                          "type": {
				                            "kind": "literal",
				                            "subkind": "string",
				                            "value": "import type { Snippet } from 'svelte'",
				                          },
				                        },
				                      },
				                    },
				                    {
				                      "kind": "literal",
				                      "subkind": "symbol",
				                    },
				                  ],
				                },
				              },
				            ],
				            "kind": "function",
				            "sources": Set {
				              /node_modules/.pnpm/svelte@<semver>/node_modules/svelte/types/index.d.ts,
				            },
				          },
				        ],
				      },
				    },
				  },
				}
			`);
			server.shutdown();
		});

		it("it allows picking selected keys", async ({ expect }) => {
			const server = createServer();
			server.start();
			const data = await server.request({
				filepath: path.join(__dirname, "..", "..", "examples", "test.svelte"),
				keys: ["isLegacy"],
			});
			expect(data).toMatchInlineSnapshot(`
				{
				  "isLegacy": false,
				}
			`);
			expect(data.isLegacy).toBeDefined();
			// @ts-expect-error Testing
			expect(data.props).not.toBeDefined();
			expect(Object.keys(data).length).toBe(1);
			server.shutdown();
		});
	});

	describe("shutdown()", () => {
		it("shutdowns the server instance", ({ expect }) => {
			const server = createServer();
			server.start();
			server.shutdown();
			expect(server.instance).not.toBeDefined();
		});
	});
});
