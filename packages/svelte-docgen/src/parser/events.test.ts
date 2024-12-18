import { describe, it } from "vitest";

import { create_options } from "../../tests/shared.js";
import { parse } from "../mod.js";

describe("events", () => {
	it("returns empty map is component doesn't create custom events (legacy)", ({ expect }) => {
		const { events, isLegacy } = parse(
			`
			<script lang="ts">
				export let onclick = () => {};
			</script>

			<button on:click={onclick}>Click me</button>
			`,
			create_options("no-events.svelte"),
		);
		expect(isLegacy).toBe(true);
		expect(events).toMatchInlineSnapshot("Map {}");
		expect(events.size).toBe(0);
	});

	it("returns map with available custom events (legacy) prefixed with `on:`", ({ expect }) => {
		const { events, isLegacy } = parse(
			`
			<script lang="ts">
				import { createEventDispatcher } from "svelte";
				const dispatch = createEventDispatcher<{
					decrement: number;
					increment: number;
				}>();
				export let disabled = false;
			</script>

			<button {disabled} on:click={() => dispatch('decrement', 1)}>decrement</button>
			<button {disabled} on:click={() => dispatch('increment', 1)}>increment</button>
			`,
			create_options("legacy-events.svelte"),
		);
		expect(isLegacy).toBe(true);
		expect(events).toMatchInlineSnapshot(`
			Map {
			  "on:decrement" => {
			    "constructors": [
			      [
			        {
			          "isOptional": false,
			          "name": "type",
			          "type": {
			            "kind": "string",
			          },
			        },
			        {
			          "isOptional": true,
			          "name": "eventInitDict",
			          "type": {
			            "kind": "union",
			            "nonNullable": {
			              "alias": "CustomEventInit",
			              "kind": "interface",
			              "members": Map {
			                "detail" => {
			                  "isOptional": true,
			                  "isReadonly": false,
			                  "type": {
			                    "kind": "union",
			                    "nonNullable": {
			                      "alias": "NonNullable",
			                      "kind": "intersection",
			                      "sources": Set {
			                        /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es5.d.ts,
			                      },
			                      "types": [
			                        {
			                          "constraint": {
			                            "kind": "unknown",
			                          },
			                          "isConst": false,
			                          "kind": "type-parameter",
			                          "name": "T",
			                        },
			                        {
			                          "kind": "object",
			                        },
			                      ],
			                    },
			                    "types": [
			                      {
			                        "kind": "undefined",
			                      },
			                      {
			                        "constraint": {
			                          "kind": "unknown",
			                        },
			                        "isConst": false,
			                        "kind": "type-parameter",
			                        "name": "T",
			                      },
			                    ],
			                  },
			                },
			                "bubbles" => {
			                  "isOptional": true,
			                  "isReadonly": false,
			                  "type": {
			                    "kind": "union",
			                    "nonNullable": {
			                      "kind": "boolean",
			                    },
			                    "types": [
			                      {
			                        "kind": "undefined",
			                      },
			                      {
			                        "kind": "literal",
			                        "subkind": "boolean",
			                        "value": false,
			                      },
			                      {
			                        "kind": "literal",
			                        "subkind": "boolean",
			                        "value": true,
			                      },
			                    ],
			                  },
			                },
			                "cancelable" => {
			                  "isOptional": true,
			                  "isReadonly": false,
			                  "type": {
			                    "kind": "union",
			                    "nonNullable": {
			                      "kind": "boolean",
			                    },
			                    "types": [
			                      {
			                        "kind": "undefined",
			                      },
			                      {
			                        "kind": "literal",
			                        "subkind": "boolean",
			                        "value": false,
			                      },
			                      {
			                        "kind": "literal",
			                        "subkind": "boolean",
			                        "value": true,
			                      },
			                    ],
			                  },
			                },
			                "composed" => {
			                  "isOptional": true,
			                  "isReadonly": false,
			                  "type": {
			                    "kind": "union",
			                    "nonNullable": {
			                      "kind": "boolean",
			                    },
			                    "types": [
			                      {
			                        "kind": "undefined",
			                      },
			                      {
			                        "kind": "literal",
			                        "subkind": "boolean",
			                        "value": false,
			                      },
			                      {
			                        "kind": "literal",
			                        "subkind": "boolean",
			                        "value": true,
			                      },
			                    ],
			                  },
			                },
			              },
			              "sources": Set {
			                /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.dom.d.ts,
			              },
			            },
			            "types": [
			              {
			                "kind": "undefined",
			              },
			              {
			                "alias": "CustomEventInit",
			                "kind": "interface",
			                "members": Map {
			                  "detail" => {
			                    "isOptional": true,
			                    "isReadonly": false,
			                    "type": {
			                      "kind": "union",
			                      "nonNullable": {
			                        "alias": "NonNullable",
			                        "kind": "intersection",
			                        "sources": Set {
			                          /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.es5.d.ts,
			                        },
			                        "types": [
			                          {
			                            "constraint": {
			                              "kind": "unknown",
			                            },
			                            "isConst": false,
			                            "kind": "type-parameter",
			                            "name": "T",
			                          },
			                          {
			                            "kind": "object",
			                          },
			                        ],
			                      },
			                      "types": [
			                        {
			                          "kind": "undefined",
			                        },
			                        {
			                          "constraint": {
			                            "kind": "unknown",
			                          },
			                          "isConst": false,
			                          "kind": "type-parameter",
			                          "name": "T",
			                        },
			                      ],
			                    },
			                  },
			                  "bubbles" => {
			                    "isOptional": true,
			                    "isReadonly": false,
			                    "type": {
			                      "kind": "union",
			                      "nonNullable": {
			                        "kind": "boolean",
			                      },
			                      "types": [
			                        {
			                          "kind": "undefined",
			                        },
			                        {
			                          "kind": "literal",
			                          "subkind": "boolean",
			                          "value": false,
			                        },
			                        {
			                          "kind": "literal",
			                          "subkind": "boolean",
			                          "value": true,
			                        },
			                      ],
			                    },
			                  },
			                  "cancelable" => {
			                    "isOptional": true,
			                    "isReadonly": false,
			                    "type": {
			                      "kind": "union",
			                      "nonNullable": {
			                        "kind": "boolean",
			                      },
			                      "types": [
			                        {
			                          "kind": "undefined",
			                        },
			                        {
			                          "kind": "literal",
			                          "subkind": "boolean",
			                          "value": false,
			                        },
			                        {
			                          "kind": "literal",
			                          "subkind": "boolean",
			                          "value": true,
			                        },
			                      ],
			                    },
			                  },
			                  "composed" => {
			                    "isOptional": true,
			                    "isReadonly": false,
			                    "type": {
			                      "kind": "union",
			                      "nonNullable": {
			                        "kind": "boolean",
			                      },
			                      "types": [
			                        {
			                          "kind": "undefined",
			                        },
			                        {
			                          "kind": "literal",
			                          "subkind": "boolean",
			                          "value": false,
			                        },
			                        {
			                          "kind": "literal",
			                          "subkind": "boolean",
			                          "value": true,
			                        },
			                      ],
			                    },
			                  },
			                },
			                "sources": Set {
			                  /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.dom.d.ts,
			                },
			              },
			            ],
			          },
			        },
			      ],
			    ],
			    "kind": "constructible",
			    "name": "CustomEvent",
			    "sources": Set {
			      /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.dom.d.ts,
			    },
			  },
			  "on:increment" => {
			    "constructors": "self",
			    "kind": "constructible",
			    "name": "CustomEvent",
			    "sources": Set {
			      /node_modules/.pnpm/typescript@<semver>/node_modules/typescript/lib/lib.dom.d.ts,
			    },
			  },
			}
		`);
		for (const key of events.keys()) {
			expect(key.startsWith("on:")).toBe(true);
		}
	});
});
