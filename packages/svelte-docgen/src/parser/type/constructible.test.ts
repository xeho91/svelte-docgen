import { describe, it } from "vitest";

import { create_options } from "../../../tests/shared.js";
import type { Doc } from "../../doc/type.js";
import { parse } from "../mod.js";

describe("Constructible", () => {
	const { props } = parse(
		`
		<script lang="ts">
			class Custom {
				foo: string;
				bar?: number;
				baz: string;
				constructor(foo: string, bar?: number, baz = "hello") {
					this.foo = foo;
					this.bar = bar;
					this.baz = baz;
				}
			}
			interface Props {
				custom: Custom;
				date: Date;
				map: Map<string, number>;
				set: Set<string>;
			}
			let { ..._ }: Props = $props();
		</script>
		`,
		create_options("constructible.svelte"),
	);

	it("documents 'constructible' - custom", ({ expect }) => {
		const custom = props.get("custom");
		expect(custom).toBeDefined();
		expect(custom?.type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [
			      {
			        "isOptional": false,
			        "name": "foo",
			        "type": {
			          "kind": "string",
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "bar",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": false,
			        "name": "baz",
			        "type": {
			          "kind": "string",
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Custom",
			  "sources": Set {
			    "constructible.svelte",
			  },
			}
		`);
		expect(custom?.type.kind).toBe("constructible");
		expect((custom?.type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
	});

	it("recognizes builtin `Date`", ({ expect }) => {
		const date = props.get("date");
		expect(date).toBeDefined();
		expect(date?.type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [],
			    [
			      {
			        "isOptional": false,
			        "name": "value",
			        "type": {
			          "kind": "union",
			          "types": [
			            {
			              "kind": "string",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			    ],
			    [
			      {
			        "isOptional": false,
			        "name": "year",
			        "type": {
			          "kind": "number",
			        },
			      },
			      {
			        "isOptional": false,
			        "name": "monthIndex",
			        "type": {
			          "kind": "number",
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "date",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "hours",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "minutes",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "seconds",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			      {
			        "isOptional": true,
			        "name": "ms",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "kind": "number",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "number",
			            },
			          ],
			        },
			      },
			    ],
			    [
			      {
			        "isOptional": false,
			        "name": "value",
			        "type": {
			          "kind": "union",
			          "types": [
			            {
			              "kind": "string",
			            },
			            {
			              "kind": "number",
			            },
			            {
			              "constructors": "self",
			              "kind": "constructible",
			              "name": "Date",
			              "sources": Set {
			                <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es5.d.ts,
			                <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			                <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2020.date.d.ts,
			              },
			            },
			          ],
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Date",
			  "sources": Set {
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es5.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2020.date.d.ts,
			  },
			}
		`);
		expect(date?.type.kind).toBe("constructible");
		expect((date?.type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
	});

	it("recognizes builtin `Map`", ({ expect }) => {
		const map = props.get("map");
		expect(map).toBeDefined();
		expect(map?.type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [],
			    [
			      {
			        "isOptional": true,
			        "name": "entries",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "element": {
			              "elements": [
			                {
			                  "constraint": {
			                    "kind": "unknown",
			                  },
			                  "isConst": false,
			                  "kind": "type-parameter",
			                  "name": "K",
			                },
			                {
			                  "constraint": {
			                    "kind": "unknown",
			                  },
			                  "isConst": false,
			                  "kind": "type-parameter",
			                  "name": "V",
			                },
			              ],
			              "isReadonly": true,
			              "kind": "tuple",
			            },
			            "isReadonly": true,
			            "kind": "array",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			            {
			              "element": {
			                "elements": [
			                  {
			                    "constraint": {
			                      "kind": "unknown",
			                    },
			                    "isConst": false,
			                    "kind": "type-parameter",
			                    "name": "K",
			                  },
			                  {
			                    "constraint": {
			                      "kind": "unknown",
			                    },
			                    "isConst": false,
			                    "kind": "type-parameter",
			                    "name": "V",
			                  },
			                ],
			                "isReadonly": true,
			                "kind": "tuple",
			              },
			              "isReadonly": true,
			              "kind": "array",
			            },
			          ],
			        },
			      },
			    ],
			    [],
			    [
			      {
			        "isOptional": true,
			        "name": "iterable",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "alias": "Iterable",
			            "kind": "interface",
			            "members": Map {
			              "__@iterator@88" => {
			                "isOptional": false,
			                "isReadonly": false,
			                "type": {
			                  "alias": "__@iterator@88",
			                  "calls": [
			                    {
			                      "parameters": [],
			                      "returns": {
			                        "constructors": [
			                          [],
			                        ],
			                        "kind": "constructible",
			                        "name": "Iterator",
			                        "sources": Set {
			                          <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			                          <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
			                        },
			                      },
			                    },
			                  ],
			                  "kind": "function",
			                },
			              },
			            },
			            "sources": Set {
			              <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			            },
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			            {
			              "alias": "Iterable",
			              "kind": "interface",
			              "members": Map {
			                "__@iterator@88" => {
			                  "isOptional": false,
			                  "isReadonly": false,
			                  "type": {
			                    "alias": "__@iterator@88",
			                    "calls": [
			                      {
			                        "parameters": [],
			                        "returns": {
			                          "constructors": [
			                            [],
			                          ],
			                          "kind": "constructible",
			                          "name": "Iterator",
			                          "sources": Set {
			                            <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			                            <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
			                          },
			                        },
			                      },
			                    ],
			                    "kind": "function",
			                  },
			                },
			              },
			              "sources": Set {
			                <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			              },
			            },
			          ],
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Map",
			  "sources": Set {
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.collection.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			  },
			}
		`);
		expect(map?.type.kind).toBe("constructible");
		expect((map?.type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
	});

	it("recognizes builtin `Set`", ({ expect }) => {
		const set = props.get("set");
		expect(set).toBeDefined();
		expect(set?.type).toMatchInlineSnapshot(`
			{
			  "constructors": [
			    [
			      {
			        "isOptional": true,
			        "name": "values",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "element": {
			              "constraint": {
			                "kind": "unknown",
			              },
			              "default": {
			                "kind": "any",
			              },
			              "isConst": false,
			              "kind": "type-parameter",
			              "name": "T",
			            },
			            "isReadonly": true,
			            "kind": "array",
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			            {
			              "element": {
			                "constraint": {
			                  "kind": "unknown",
			                },
			                "default": {
			                  "kind": "any",
			                },
			                "isConst": false,
			                "kind": "type-parameter",
			                "name": "T",
			              },
			              "isReadonly": true,
			              "kind": "array",
			            },
			          ],
			        },
			      },
			    ],
			    [
			      {
			        "isOptional": true,
			        "name": "iterable",
			        "type": {
			          "kind": "union",
			          "nonNullable": {
			            "alias": "Iterable",
			            "kind": "interface",
			            "members": Map {
			              "__@iterator@88" => {
			                "isOptional": false,
			                "isReadonly": false,
			                "type": {
			                  "alias": "__@iterator@88",
			                  "calls": [
			                    {
			                      "parameters": [],
			                      "returns": {
			                        "constructors": [
			                          [],
			                        ],
			                        "kind": "constructible",
			                        "name": "Iterator",
			                        "sources": Set {
			                          <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			                          <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
			                        },
			                      },
			                    },
			                  ],
			                  "kind": "function",
			                },
			              },
			            },
			            "sources": Set {
			              <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			            },
			          },
			          "types": [
			            {
			              "kind": "undefined",
			            },
			            {
			              "kind": "null",
			            },
			            {
			              "alias": "Iterable",
			              "kind": "interface",
			              "members": Map {
			                "__@iterator@88" => {
			                  "isOptional": false,
			                  "isReadonly": false,
			                  "type": {
			                    "alias": "__@iterator@88",
			                    "calls": [
			                      {
			                        "parameters": [],
			                        "returns": {
			                          "constructors": [
			                            [],
			                          ],
			                          "kind": "constructible",
			                          "name": "Iterator",
			                          "sources": Set {
			                            <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			                            <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.esnext.iterator.d.ts,
			                          },
			                        },
			                      },
			                    ],
			                    "kind": "function",
			                  },
			                },
			              },
			              "sources": Set {
			                <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			              },
			            },
			          ],
			        },
			      },
			    ],
			  ],
			  "kind": "constructible",
			  "name": "Set",
			  "sources": Set {
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.collection.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.iterable.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts,
			    <process-cwd>/node_modules/.pnpm/typescript@5.7.2/node_modules/typescript/lib/lib.esnext.collection.d.ts,
			  },
			}
		`);
		expect(set?.type.kind).toBe("constructible");
		expect((set?.type as Doc.Constructible).constructors.length).toBeGreaterThan(0);
	});
});
